"""
Air Quality Monitoring Backend Service
FastAPI + Redis + WAQI API Integration
"""
import logging
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from scheduler import AirQualityScheduler
from cache_manager import CacheManager
from models import CityInfo, StationData, CityListResponse, HistoryResponse
from config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle manager for FastAPI application.
    Handles startup and shutdown events.
    """
    logger.info("Starting Air Quality Monitoring Service...")
    
    # Initialize cache manager
    cache_manager = CacheManager()
    await cache_manager.connect()
    app.state.cache_manager = cache_manager
    
    # Initialize and start scheduler
    scheduler = AirQualityScheduler(cache_manager)
    await scheduler.initialize()
    scheduler.start()
    app.state.scheduler = scheduler
    
    logger.info("Service started successfully!")
    
    yield
    
    # Shutdown
    logger.info("Shutting down service...")
    scheduler.stop()
    await cache_manager.disconnect()
    logger.info("Service stopped.")


# Initialize FastAPI app
app = FastAPI(
    title="Air Quality Monitoring API",
    description="Backend service for tracking air quality across major U.S. cities",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Air Quality Monitoring API",
        "version": "1.0.0"
    }


@app.get("/api/cities", response_model=CityListResponse, tags=["Cities"])
async def get_cities():
    """
    Get list of all monitored cities with their stations.
    
    Returns:
        List of cities with station information
    """
    try:
        cache_manager: CacheManager = app.state.cache_manager
        cities = await cache_manager.get_all_cities()
        
        if not cities:
            raise HTTPException(
                status_code=503,
                detail="Cities data not yet initialized. Please try again in a moment."
            )
        
        return CityListResponse(cities=cities, count=len(cities))
    
    except Exception as e:
        logger.error(f"Error fetching cities: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/airquality", response_model=StationData, tags=["Air Quality"])
async def get_air_quality(
    city: str = Query(..., description="City name (case-insensitive)")
):
    """
    Get latest air quality data for a specific city.
    
    Args:
        city: Name of the city
        
    Returns:
        Latest air quality data including AQI, pollutants, weather, and forecast
    """
    try:
        cache_manager: CacheManager = app.state.cache_manager
        scheduler: AirQualityScheduler = app.state.scheduler
        
        # Get station ID for the city
        station_id = await cache_manager.get_station_for_city(city)
        
        if not station_id:
            raise HTTPException(
                status_code=404,
                detail=f"City '{city}' not found or not configured"
            )
        
        # Try to get cached data
        data = await cache_manager.get_latest_station_data(station_id)
        
        # If no cache, trigger immediate fetch (lazy load)
        if not data:
            logger.info(f"Cache miss for {city}, fetching immediately...")
            data = await scheduler.fetch_station_data(station_id, city)
            
            if not data:
                raise HTTPException(
                    status_code=503,
                    detail=f"Unable to fetch data for {city}. Please try again later."
                )
        
        return data
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching air quality for {city}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/station/{station_id}", response_model=StationData, tags=["Air Quality"])
async def get_station_data(station_id: str):
    """
    Get latest air quality data for a specific station.
    
    Args:
        station_id: WAQI station identifier
        
    Returns:
        Latest air quality data for the station
    """
    try:
        cache_manager: CacheManager = app.state.cache_manager
        
        data = await cache_manager.get_latest_station_data(station_id)
        
        if not data:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for station {station_id}"
            )
        
        return data
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching station data for {station_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/history", response_model=HistoryResponse, tags=["Air Quality"])
async def get_history(
    city: str = Query(..., description="City name"),
    hours: int = Query(24, ge=1, le=48, description="Number of hours of history (1-48)")
):
    """
    Get historical air quality data for a city.
    
    Args:
        city: Name of the city
        hours: Number of hours of historical data to retrieve (default: 24, max: 48)
        
    Returns:
        Historical air quality data points
    """
    try:
        cache_manager: CacheManager = app.state.cache_manager
        
        # Get station ID for the city
        station_id = await cache_manager.get_station_for_city(city)
        
        if not station_id:
            raise HTTPException(
                status_code=404,
                detail=f"City '{city}' not found or not configured"
            )
        
        # Get historical data
        history = await cache_manager.get_station_history(station_id, hours)
        
        return HistoryResponse(
            city=city,
            station_id=station_id,
            hours=hours,
            data_points=len(history),
            history=history
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching history for {city}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/stats", tags=["Monitoring"])
async def get_stats():
    """
    Get service statistics and monitoring info.
    
    Returns:
        Service statistics including cache stats and last update times
    """
    try:
        cache_manager: CacheManager = app.state.cache_manager
        scheduler: AirQualityScheduler = app.state.scheduler
        
        cities = await cache_manager.get_all_cities()
        stats = {
            "total_cities": len(cities),
            "total_stations": len(set(city.station_id for city in cities if city.station_id)),
            "last_update": scheduler.last_update_time.isoformat() if scheduler.last_update_time else None,
            "next_update": scheduler.next_update_time.isoformat() if scheduler.next_update_time else None,
            "cache_type": "redis" if settings.REDIS_URL else "in-memory"
        }
        
        return stats
    
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/debug/raw/{station_id}", tags=["Debug"])
async def get_raw_station_data(station_id: str):
    """
    Get raw WAQI API response for debugging purposes.
    
    Args:
        station_id: WAQI station identifier
        
    Returns:
        Raw API response from WAQI
    """
    try:
        from waqi_client import get_waqi_client
        
        client = get_waqi_client()
        raw_data = await client.get_station_data(station_id)
        
        if not raw_data:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for station {station_id}"
            )
        
        return {
            "station_id": station_id,
            "raw_response": raw_data,
            "forecast_keys": list(raw_data.get("forecast", {}).keys()) if "forecast" in raw_data else []
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching raw station data: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
"""
Background Scheduler for Air Quality Data Updates
Handles periodic fetching and caching of air quality data
"""
import logging
import json
from datetime import datetime, timedelta
from typing import List, Optional
from pathlib import Path

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from waqi_client import get_waqi_client
from cache_manager import CacheManager
from models import CityConfig, StationData

logger = logging.getLogger(__name__)


class AirQualityScheduler:
    """Scheduler for periodic air quality data updates."""
    
    def __init__(self, cache_manager: CacheManager):
        """
        Initialize the scheduler.
        
        Args:
            cache_manager: CacheManager instance for storing data
        """
        self.cache_manager = cache_manager
        self.scheduler = AsyncIOScheduler()
        self.cities: List[CityConfig] = []
        self.last_update_time: Optional[datetime] = None
        self.next_update_time: Optional[datetime] = None
    
    async def initialize(self):
        """
        Initialize the scheduler by loading cities and discovering stations.
        """
        logger.info("Initializing scheduler...")
        
        # Load cities from config
        self.cities = self._load_cities_config()
        logger.info(f"Loaded {len(self.cities)} cities from configuration")
        
        # Discover stations for each city
        await self._discover_stations()
        
        # Perform initial data fetch
        await self.fetch_all_stations()
        
        logger.info("Scheduler initialized successfully")
    
    def _load_cities_config(self) -> List[CityConfig]:
        """
        Load cities configuration from cities.json.
        
        Returns:
            List of CityConfig objects
        """
        config_path = Path("cities.json")
        
        if not config_path.exists():
            logger.error("cities.json not found!")
            return []
        
        try:
            with open(config_path, 'r') as f:
                data = json.load(f)
            
            cities = [CityConfig(**city) for city in data]
            return cities
        
        except Exception as e:
            logger.error(f"Error loading cities configuration: {e}")
            return []
    
    async def _discover_stations(self):
        """
        Discover nearest stations for all configured cities.
        """
        logger.info("Discovering stations for cities...")
        client = get_waqi_client()
        
        for city in self.cities:
            try:
                # Get nearest station
                station_data = await client.get_nearest_station(city.lat, city.lon)
                
                if station_data:
                    station_id = str(station_data.get("idx", ""))
                    station_name = station_data.get("city", {}).get("name", "Unknown")
                    
                    city.station_id = station_id
                    city.station_name = station_name
                    
                    # Store city-to-station mapping in cache
                    await self.cache_manager.set_city_station_mapping(
                        city.city, station_id, station_name
                    )
                    
                    logger.info(f"Found station for {city.city}: {station_name} (ID: {station_id})")
                else:
                    logger.warning(f"No station found for {city.city}")
            
            except Exception as e:
                logger.error(f"Error discovering station for {city.city}: {e}")
    
    async def fetch_all_stations(self):
        """
        Fetch air quality data for all stations and cache results.
        """
        logger.info("Fetching data for all stations...")
        self.last_update_time = datetime.utcnow()
        
        client = get_waqi_client()
        success_count = 0
        error_count = 0
        
        for city in self.cities:
            if not city.station_id:
                logger.warning(f"Skipping {city.city} - no station ID")
                continue
            
            try:
                # Fetch station data
                raw_data = await client.get_station_data(city.station_id)
                
                if raw_data:
                    # Parse data - use configured city name, not API response
                    station_data = client.parse_station_data(raw_data, city.city)
                    
                    if station_data:
                        # Override city name to ensure consistency
                        station_data.city = city.city
                        
                        # Cache the data
                        await self.cache_manager.cache_station_data(
                            city.station_id, station_data
                        )
                        success_count += 1
                        logger.info(f"Updated data for {city.city} (AQI: {station_data.aqi})")
                    else:
                        logger.error(f"Failed to parse data for {city.city}")
                        error_count += 1
                else:
                    logger.error(f"Failed to fetch data for {city.city}")
                    error_count += 1
            
            except Exception as e:
                logger.error(f"Error updating {city.city}: {e}")
                error_count += 1
        
        logger.info(
            f"Update complete: {success_count} successful, {error_count} errors"
        )
        
        # Set next update time
        self.next_update_time = datetime.utcnow() + timedelta(hours=1)
    
    async def fetch_station_data(
        self, station_id: str, city: str
    ) -> Optional[StationData]:
        """
        Fetch data for a specific station (used for lazy loading).
        
        Args:
            station_id: WAQI station identifier
            city: City name
            
        Returns:
            StationData or None if fetch fails
        """
        try:
            client = get_waqi_client()
            raw_data = await client.get_station_data(station_id)
            
            if raw_data:
                station_data = client.parse_station_data(raw_data, city)
                
                if station_data:
                    # Cache the data
                    await self.cache_manager.cache_station_data(
                        station_id, station_data
                    )
                    logger.info(f"Fetched and cached data for {city} (station {station_id})")
                    return station_data
            
            return None
        
        except Exception as e:
            logger.error(f"Error fetching station {station_id}: {e}")
            return None
    
    def start(self):
        """
        Start the background scheduler.
        Schedules hourly updates of all station data.
        """
        # Schedule hourly updates
        self.scheduler.add_job(
            self.fetch_all_stations,
            trigger=IntervalTrigger(hours=1),
            id='fetch_all_stations',
            name='Fetch all station data',
            replace_existing=True
        )
        
        self.scheduler.start()
        logger.info("Scheduler started - updates will run every hour")
    
    def stop(self):
        """Stop the background scheduler."""
        if self.scheduler.running:
            self.scheduler.shutdown()
            logger.info("Scheduler stopped")
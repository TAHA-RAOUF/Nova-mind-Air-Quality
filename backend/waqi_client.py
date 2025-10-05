"""
WAQI (World Air Quality Index) API Client
Handles all interactions with the WAQI API
"""
import logging
from typing import Optional, Dict, Any
import httpx

from models import StationData, Pollutants, Weather, ForecastDay
from config import settings

logger = logging.getLogger(__name__)


class WAQIClient:
    """Client for interacting with WAQI API."""
    
    BASE_URL = "https://api.waqi.info"
    
    def __init__(self, token: str):
        """
        Initialize WAQI client.
        
        Args:
            token: WAQI API token
        """
        self.token = token
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
    
    async def get_nearest_station(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        """
        Get nearest air quality monitoring station for given coordinates.
        
        Args:
            lat: Latitude
            lon: Longitude
            
        Returns:
            Station data dict or None if not found
        """
        url = f"{self.BASE_URL}/feed/geo:{lat};{lon}/"
        params = {"token": self.token}
        
        try:
            logger.info(f"Fetching nearest station for coordinates ({lat}, {lon})")
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("status") != "ok":
                logger.error(f"WAQI API error: {data.get('data', 'Unknown error')}")
                return None
            
            return data.get("data")
        
        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching nearest station: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching nearest station: {e}")
            return None
    
    async def get_station_data(self, station_id: str) -> Optional[Dict[str, Any]]:
        """
        Get air quality data for a specific station.
        
        Args:
            station_id: WAQI station identifier
            
        Returns:
            Station data dict or None if not found
        """
        url = f"{self.BASE_URL}/feed/@{station_id}/"
        params = {"token": self.token}
        
        try:
            logger.info(f"Fetching data for station {station_id}")
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("status") != "ok":
                logger.error(f"WAQI API error for station {station_id}: {data.get('data', 'Unknown error')}")
                return None
            
            return data.get("data")
        
        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching station {station_id}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching station {station_id}: {e}")
            return None
    
    def parse_station_data(self, raw_data: Dict[str, Any], city: str) -> Optional[StationData]:
        """
        Parse raw WAQI API response into StationData model.
        
        Args:
            raw_data: Raw data from WAQI API
            city: City name
            
        Returns:
            Parsed StationData or None if parsing fails
        """
        try:
            # Extract basic info
            station_name = raw_data.get("city", {}).get("name", "Unknown")
            aqi = raw_data.get("aqi", 0)
            dominant = raw_data.get("dominentpol", "")
            timestamp = raw_data.get("time", {}).get("iso", "")
            
            logger.debug(f"Parsing data for {city}: AQI={aqi}, dominant={dominant}")
            
            # Extract pollutants from iaqi
            iaqi = raw_data.get("iaqi", {})
            pollutants = Pollutants(
                pm25=self._extract_value(iaqi.get("pm25")),
                pm10=self._extract_value(iaqi.get("pm10")),
                no2=self._extract_value(iaqi.get("no2")),
                o3=self._extract_value(iaqi.get("o3")),
                so2=self._extract_value(iaqi.get("so2")),
                co=self._extract_value(iaqi.get("co"))
            )
            
            # Extract weather data
            weather = Weather(
                temperature=self._extract_value(iaqi.get("t")),
                humidity=self._extract_value(iaqi.get("h")),
                wind=self._extract_value(iaqi.get("w")),
                pressure=self._extract_value(iaqi.get("p"))
            )
            
            # Extract forecast data
            forecast_raw = raw_data.get("forecast", {})
            logger.debug(f"Raw forecast data keys: {list(forecast_raw.keys()) if forecast_raw else 'None'}")
            
            forecast = self._parse_forecast(forecast_raw)
            
            if not forecast:
                logger.warning(f"No forecast data available for {city}")
            
            return StationData(
                city=city,
                station=station_name,
                timestamp=timestamp,
                aqi=aqi,
                dominant=dominant,
                pollutants=pollutants,
                weather=weather,
                forecast=forecast
            )
        
        except Exception as e:
            logger.error(f"Error parsing station data for {city}: {e}", exc_info=True)
            return None
    
    def _extract_value(self, data: Optional[Dict]) -> Optional[float]:
        """
        Extract numeric value from WAQI data structure.
        
        Args:
            data: WAQI data dict with 'v' key
            
        Returns:
            Numeric value or None
        """
        if data and isinstance(data, dict):
            return data.get("v")
        return None
    
    def _parse_forecast(self, forecast_data: Dict) -> Dict[str, list]:
        """
        Parse forecast data from WAQI API.
        
        Args:
            forecast_data: Raw forecast dict
            
        Returns:
            Parsed forecast dict with lists of ForecastDay objects
        """
        result = {}
        
        if not forecast_data:
            logger.debug("No forecast data available")
            return result
        
        # WAQI API returns forecast in this structure:
        # {"daily": {"pm25": [...], "pm10": [...], "o3": [...], "uvi": [...]}}
        daily_forecasts = forecast_data.get("daily", {})
        
        if not daily_forecasts:
            logger.debug("No daily forecast data found")
            return result
        
        # Parse each pollutant forecast
        for pollutant in ["pm25", "pm10", "o3", "uvi"]:
            try:
                if pollutant not in daily_forecasts:
                    logger.debug(f"No forecast data for {pollutant}")
                    continue
                
                daily_data = daily_forecasts[pollutant]
                
                if not isinstance(daily_data, list):
                    logger.debug(f"Invalid forecast data format for {pollutant}")
                    continue
                
                forecast_list = []
                for item in daily_data:
                    try:
                        # Skip invalid items
                        if not isinstance(item, dict):
                            continue
                        
                        # Extract values with proper type checking
                        day = item.get("day", "")
                        avg_val = item.get("avg")
                        max_val = item.get("max")
                        min_val = item.get("min")
                        
                        # Convert to float if they're numeric
                        if avg_val is not None:
                            avg_val = float(avg_val)
                        if max_val is not None:
                            max_val = float(max_val)
                        if min_val is not None:
                            min_val = float(min_val)
                        
                        forecast_day = ForecastDay(
                            day=day,
                            avg=avg_val,
                            max=max_val,
                            min=min_val
                        )
                        forecast_list.append(forecast_day)
                        
                    except Exception as e:
                        logger.warning(f"Error parsing forecast item for {pollutant}: {e}")
                        continue
                
                if forecast_list:
                    result[pollutant] = forecast_list
                    logger.debug(f"Parsed {len(forecast_list)} forecast days for {pollutant}")
                    
            except Exception as e:
                logger.warning(f"Error parsing forecast for {pollutant}: {e}")
                continue
        
        if result:
            logger.info(f"Successfully parsed forecast data for: {list(result.keys())}")
        else:
            logger.warning("No forecast data could be parsed from response")
        
        return result


# Global client instance
_client: Optional[WAQIClient] = None


def get_waqi_client() -> WAQIClient:
    """
    Get or create WAQI client instance.
    
    Returns:
        WAQIClient instance
    """
    global _client
    if _client is None:
        _client = WAQIClient(settings.WAQI_TOKEN)
    return _client


async def close_waqi_client():
    """Close the global WAQI client."""
    global _client
    if _client:
        await _client.close()
        _client = None
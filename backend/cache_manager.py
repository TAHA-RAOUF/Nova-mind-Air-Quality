"""
Cache Manager for Air Quality Data
Supports both Redis and in-memory caching
"""
import logging
import json
from datetime import datetime, timedelta
from typing import Optional, List, Dict
import redis.asyncio as redis

from models import StationData, CityInfo
from config import settings

logger = logging.getLogger(__name__)


class CacheManager:
    """
    Cache manager supporting Redis and in-memory fallback.
    Handles storage and retrieval of air quality data.
    """
    
    def __init__(self):
        """Initialize the cache manager."""
        self.redis_client: Optional[redis.Redis] = None
        self.memory_cache: Dict = {}
        self.use_redis = False
    
    async def connect(self):
        """Connect to Redis or initialize in-memory cache."""
        if settings.REDIS_URL:
            try:
                self.redis_client = redis.from_url(
                    settings.REDIS_URL,
                    encoding="utf-8",
                    decode_responses=True
                )
                # Test connection
                await self.redis_client.ping()
                self.use_redis = True
                logger.info(f"Connected to Redis at {settings.REDIS_URL}")
            except Exception as e:
                logger.warning(f"Failed to connect to Redis: {e}. Using in-memory cache.")
                self.use_redis = False
                self.memory_cache = {}
        else:
            logger.info("No Redis URL configured. Using in-memory cache.")
            self.use_redis = False
            self.memory_cache = {}
    
    async def disconnect(self):
        """Disconnect from Redis."""
        if self.redis_client:
            await self.redis_client.close()
            logger.info("Disconnected from Redis")
    
    async def cache_station_data(self, station_id: str, data: StationData):
        """
        Cache station data with timestamp.
        
        Args:
            station_id: WAQI station identifier
            data: StationData object to cache
        """
        try:
            timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
            cache_key = f"airquality:{station_id}:{timestamp}"
            latest_key = f"airquality:latest:{station_id}"
            
            # Serialize data
            data_json = data.model_dump_json()
            
            if self.use_redis:
                # Store in Redis
                await self.redis_client.setex(
                    cache_key,
                    settings.CACHE_TTL_HOURS * 3600,
                    data_json
                )
                
                # Update latest pointer
                await self.redis_client.setex(
                    latest_key,
                    settings.CACHE_TTL_HOURS * 3600,
                    data_json
                )
                
                # Add to sorted set for history
                score = datetime.utcnow().timestamp()
                await self.redis_client.zadd(
                    f"airquality:history:{station_id}",
                    {cache_key: score}
                )
                
                # Clean old history (keep only last 48 hours)
                cutoff_time = datetime.utcnow() - timedelta(hours=48)
                await self.redis_client.zremrangebyscore(
                    f"airquality:history:{station_id}",
                    0,
                    cutoff_time.timestamp()
                )
            else:
                # Store in memory
                if station_id not in self.memory_cache:
                    self.memory_cache[station_id] = {
                        'latest': None,
                        'history': []
                    }
                
                self.memory_cache[station_id]['latest'] = data_json
                self.memory_cache[station_id]['history'].append({
                    'timestamp': datetime.utcnow(),
                    'data': data_json
                })
                
                # Keep only last 48 hours in memory
                cutoff = datetime.utcnow() - timedelta(hours=48)
                self.memory_cache[station_id]['history'] = [
                    item for item in self.memory_cache[station_id]['history']
                    if item['timestamp'] > cutoff
                ]
        
        except Exception as e:
            logger.error(f"Error caching station data: {e}")
    
    async def get_latest_station_data(self, station_id: str) -> Optional[StationData]:
        """
        Get the latest cached data for a station.
        
        Args:
            station_id: WAQI station identifier
            
        Returns:
            StationData or None if not found
        """
        try:
            latest_key = f"airquality:latest:{station_id}"
            
            if self.use_redis:
                data_json = await self.redis_client.get(latest_key)
                if data_json:
                    return StationData.model_validate_json(data_json)
            else:
                if station_id in self.memory_cache:
                    data_json = self.memory_cache[station_id].get('latest')
                    if data_json:
                        return StationData.model_validate_json(data_json)
            
            return None
        
        except Exception as e:
            logger.error(f"Error getting latest station data: {e}")
            return None
    
    async def get_station_history(
        self, station_id: str, hours: int = 24
    ) -> List[StationData]:
        """
        Get historical data for a station.
        
        Args:
            station_id: WAQI station identifier
            hours: Number of hours of history to retrieve
            
        Returns:
            List of StationData objects
        """
        try:
            history = []
            cutoff_time = datetime.utcnow() - timedelta(hours=hours)
            
            if self.use_redis:
                # Get keys from sorted set
                history_key = f"airquality:history:{station_id}"
                cache_keys = await self.redis_client.zrangebyscore(
                    history_key,
                    cutoff_time.timestamp(),
                    datetime.utcnow().timestamp()
                )
                
                # Fetch data for each key
                for key in cache_keys:
                    data_json = await self.redis_client.get(key)
                    if data_json:
                        history.append(StationData.model_validate_json(data_json))
            else:
                if station_id in self.memory_cache:
                    for item in self.memory_cache[station_id].get('history', []):
                        if item['timestamp'] > cutoff_time:
                            history.append(StationData.model_validate_json(item['data']))
            
            return sorted(history, key=lambda x: x.timestamp, reverse=True)
        
        except Exception as e:
            logger.error(f"Error getting station history: {e}")
            return []
    
    async def set_city_station_mapping(
        self, city: str, station_id: str, station_name: str
    ):
        """
        Store mapping between city and station.
        
        Args:
            city: City name
            station_id: WAQI station identifier
            station_name: Human-readable station name
        """
        try:
            mapping_key = f"city:station:{city.lower()}"
            mapping_data = json.dumps({
                'station_id': station_id,
                'station_name': station_name
            })
            
            if self.use_redis:
                await self.redis_client.set(mapping_key, mapping_data)
            else:
                if 'city_mappings' not in self.memory_cache:
                    self.memory_cache['city_mappings'] = {}
                self.memory_cache['city_mappings'][city.lower()] = mapping_data
        
        except Exception as e:
            logger.error(f"Error setting city-station mapping: {e}")
    
    async def get_station_for_city(self, city: str) -> Optional[str]:
        """
        Get station ID for a city.
        
        Args:
            city: City name (case-insensitive)
            
        Returns:
            Station ID or None if not found
        """
        try:
            mapping_key = f"city:station:{city.lower()}"
            
            if self.use_redis:
                mapping_data = await self.redis_client.get(mapping_key)
            else:
                mappings = self.memory_cache.get('city_mappings', {})
                mapping_data = mappings.get(city.lower())
            
            if mapping_data:
                mapping = json.loads(mapping_data)
                return mapping.get('station_id')
            
            return None
        
        except Exception as e:
            logger.error(f"Error getting station for city: {e}")
            return None
    
    async def get_all_cities(self) -> List[CityInfo]:
        """
        Get list of all cities with their station information.
        
        Returns:
            List of CityInfo objects
        """
        try:
            cities = []
            
            if self.use_redis:
                # Get all city mapping keys
                keys = await self.redis_client.keys("city:station:*")
                
                for key in keys:
                    city_name = key.replace("city:station:", "").title()
                    mapping_data = await self.redis_client.get(key)
                    
                    if mapping_data:
                        mapping = json.loads(mapping_data)
                        cities.append(CityInfo(
                            city=city_name,
                            station_id=mapping.get('station_id'),
                            station_name=mapping.get('station_name')
                        ))
            else:
                mappings = self.memory_cache.get('city_mappings', {})
                for city_lower, mapping_data in mappings.items():
                    mapping = json.loads(mapping_data)
                    cities.append(CityInfo(
                        city=city_lower.title(),
                        station_id=mapping.get('station_id'),
                        station_name=mapping.get('station_name')
                    ))
            
            return sorted(cities, key=lambda x: x.city)
        
        except Exception as e:
            logger.error(f"Error getting all cities: {e}")
            return []
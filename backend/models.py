"""
Pydantic Models for Air Quality Data
"""
from typing import Optional, List, Dict
from pydantic import BaseModel, Field


class CityConfig(BaseModel):
    """Configuration for a city to monitor."""
    city: str
    lat: float = 0.0  # Optional, not used for city name search
    lon: float = 0.0  # Optional, not used for city name search
    station_id: Optional[str] = None
    station_name: Optional[str] = None


class Pollutants(BaseModel):
    """Pollutant measurements."""
    pm25: Optional[float] = Field(None, description="PM2.5 concentration")
    pm10: Optional[float] = Field(None, description="PM10 concentration")
    no2: Optional[float] = Field(None, description="NO2 concentration")
    o3: Optional[float] = Field(None, description="Ozone concentration")
    so2: Optional[float] = Field(None, description="SO2 concentration")
    co: Optional[float] = Field(None, description="CO concentration")


class Weather(BaseModel):
    """Weather data."""
    temperature: Optional[float] = Field(None, description="Temperature in Celsius")
    humidity: Optional[float] = Field(None, description="Relative humidity (%)")
    wind: Optional[float] = Field(None, description="Wind speed")
    pressure: Optional[float] = Field(None, description="Atmospheric pressure")


class ForecastDay(BaseModel):
    """Single day forecast data."""
    day: str = Field(..., description="Date in YYYY-MM-DD format")
    avg: Optional[float] = Field(None, description="Average value")
    max: Optional[float] = Field(None, description="Maximum value")
    min: Optional[float] = Field(None, description="Minimum value")


class StationData(BaseModel):
    """Complete air quality data for a station."""
    city: str = Field(..., description="City name")
    station: str = Field(..., description="Station name")
    timestamp: str = Field(..., description="ISO 8601 timestamp")
    aqi: int = Field(..., description="Overall Air Quality Index")
    dominant: str = Field(..., description="Dominant pollutant")
    pollutants: Pollutants = Field(..., description="Individual pollutant measurements")
    weather: Weather = Field(..., description="Weather conditions")
    forecast: Dict[str, List[ForecastDay]] = Field(
        default_factory=dict,
        description="Forecast data by pollutant type"
    )


class CityInfo(BaseModel):
    """Information about a monitored city."""
    city: str
    station_id: Optional[str] = None
    station_name: Optional[str] = None


class CityListResponse(BaseModel):
    """Response for cities list endpoint."""
    cities: List[CityInfo]
    count: int


class HistoryResponse(BaseModel):
    """Response for history endpoint."""
    city: str
    station_id: str
    hours: int
    data_points: int
    history: List[StationData]
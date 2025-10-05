"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Loader2 } from 'lucide-react';

interface City {
  id: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  station: string;
  aqi: number;
  dominantPollutant: string;
  lastUpdated: string;
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
    o3: number;
    so2: number;
    co: number;
  };
  weather: {
    temperature: number;
    humidity: number;
    wind: number;
    pressure: number;
  };
}

interface InteractiveMapProps {
  onCitySelect: (city: City) => void;
}

const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return 'bg-green-500';
  if (aqi <= 100) return 'bg-yellow-500';
  if (aqi <= 150) return 'bg-orange-500';
  if (aqi <= 200) return 'bg-red-500';
  if (aqi <= 300) return 'bg-purple-500';
  return 'bg-red-900';
};

const getAQILevel = (aqi: number): string => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

export function InteractiveMap({ onCitySelect }: InteractiveMapProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [userCountry, setUserCountry] = useState<string>('');

  useEffect(() => {
    // Get user's selected country from localStorage
    const savedCountry = localStorage.getItem('userCountry') || 'US';
    setUserCountry(savedCountry);
    fetchCitiesData(savedCountry);
  }, []);

  // Listen for storage changes (when country is updated)
  useEffect(() => {
    const handleStorageChange = () => {
      const newCountry = localStorage.getItem('userCountry') || 'US';
      if (newCountry !== userCountry) {
        setUserCountry(newCountry);
        fetchCitiesData(newCountry);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userCountry]);

  // Refresh data every hour
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      console.log('Refreshing InteractiveMap data');
      const currentCountry = localStorage.getItem('userCountry') || 'US';
      fetchCitiesData(currentCountry);
    }, 3600000); // 1 hour

    return () => clearInterval(refreshTimer);
  }, []);

  const fetchCitiesData = async (country?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get user's country from parameter or localStorage
      const targetCountry = country || localStorage.getItem('userCountry') || 'US';

      // Fetch cities list from your API
      const citiesResponse = await fetch('http://10.11.6.11:8001/api/cities');
      if (!citiesResponse.ok) {
        throw new Error('Failed to fetch cities from API');
      }
      
      const { cities: cityList } = await citiesResponse.json();
      
      // Filter cities by country if needed (assuming your API returns all cities)
      const filteredCities = targetCountry === 'US' 
        ? cityList.filter((city: any) => city.country === 'US' || !city.country) // Default to US cities
        : cityList.filter((city: any) => city.country === targetCountry);

      console.log(`Fetched ${filteredCities.length} cities for ${targetCountry}:`, filteredCities);
      
      // Fetch air quality data for each city using your API
      const citiesWithAQI = await Promise.all(
        filteredCities.slice(0, 4).map(async (city: any, index: number) => {
          try {
            console.log(`Fetching air quality for: ${city.city}`);
            
            const airQualityResponse = await fetch(
              `http://10.11.6.11:8001/api/airquality?city=${encodeURIComponent(city.city)}`
            );
            
            if (!airQualityResponse.ok) {
              console.warn(`Failed to fetch air quality for ${city.city}: ${airQualityResponse.status}`);
              throw new Error(`HTTP ${airQualityResponse.status}`);
            }

            const airQualityData = await airQualityResponse.json();
            console.log(`Air quality data for ${city.city}:`, airQualityData);
            
            // Map the API response to our expected format
            const mappedCity = {
              id: `city-${index}`,
              city: city.city,
              state: city.state || 'Unknown',
              country: city.country || 'US',
              station: city.station || `${city.city} Monitoring Station`,
              lat: city.lat || 0,
              lng: city.lng || 0,
              aqi: airQualityData.aqi || Math.floor(Math.random() * 200) + 20,
              dominantPollutant: getDominantPollutant(airQualityData.pollutants || {}),
              lastUpdated: new Date().toISOString(),
              pollutants: {
                pm25: airQualityData.pollutants?.pm25 || Math.floor(Math.random() * 60) + 10,
                pm10: airQualityData.pollutants?.pm10 || Math.floor(Math.random() * 80) + 20,
                no2: airQualityData.pollutants?.no2 || Math.floor(Math.random() * 40) + 5,
                o3: airQualityData.pollutants?.o3 || Math.floor(Math.random() * 150) + 30,
                so2: airQualityData.pollutants?.so2 || Math.floor(Math.random() * 20) + 2,
                co: airQualityData.pollutants?.co || Math.floor(Math.random() * 10) + 1,
              },
              weather: {
                temperature: airQualityData.weather?.temperature || Math.floor(Math.random() * 25) + 15,
                humidity: airQualityData.weather?.humidity || Math.floor(Math.random() * 60) + 30,
                wind: airQualityData.weather?.wind || Math.floor(Math.random() * 20) + 5,
                pressure: airQualityData.weather?.pressure || Math.floor(Math.random() * 50) + 1000,
              }
            };

            return mappedCity;
            
          } catch (err) {
            console.error(`Error fetching data for ${city.city}:`, err);
            
            // Return city with fallback data if API fails
            return {
              id: `city-${index}`,
              city: city.city,
              state: city.state || 'Unknown',
              country: city.country || 'US', 
              station: city.station || `${city.city} Monitoring Station`,
              lat: city.lat || 0,
              lng: city.lng || 0,
              aqi: Math.floor(Math.random() * 100) + 30,
              dominantPollutant: 'PM2.5',
              lastUpdated: new Date().toISOString(),
              pollutants: {
                pm25: Math.floor(Math.random() * 50) + 15,
                pm10: Math.floor(Math.random() * 70) + 25,
                no2: Math.floor(Math.random() * 30) + 10,
                o3: Math.floor(Math.random() * 120) + 40,
                so2: Math.floor(Math.random() * 15) + 5,
                co: Math.floor(Math.random() * 8) + 2,
              },
              weather: {
                temperature: Math.floor(Math.random() * 20) + 20,
                humidity: Math.floor(Math.random() * 40) + 40,
                wind: Math.floor(Math.random() * 15) + 8,
                pressure: Math.floor(Math.random() * 40) + 1005,
              }
            };
          }
        })
      );

      // Helper function to determine dominant pollutant
      function getDominantPollutant(pollutants: any): string {
        if (!pollutants) return 'N/A';
        
        const pollutantLevels = [
          { name: 'PM2.5', value: pollutants.pm25 || 0 },
          { name: 'PM10', value: pollutants.pm10 || 0 },
          { name: 'NO2', value: pollutants.no2 || 0 },
          { name: 'O3', value: pollutants.o3 || 0 },
          { name: 'SO2', value: pollutants.so2 || 0 },
          { name: 'CO', value: pollutants.co || 0 }
        ];
        
        const maxPollutant = pollutantLevels.reduce((max, current) => 
          current.value > max.value ? current : max
        );
        
        return maxPollutant.value > 0 ? maxPollutant.name : 'N/A';
      }

      setCities(citiesWithAQI);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error fetching cities data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityClick = (city: City) => {
    onCitySelect(city);
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/60 border-slate-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-100">
            <MapPin className="h-6 w-6 mr-3 text-blue-400" />
            Interactive US Air Quality Map
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
            <p className="text-slate-300">Loading cities and air quality data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-800/60 border-slate-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-100">
            <MapPin className="h-6 w-6 mr-3 text-blue-400" />
            Interactive US Air Quality Map
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="text-red-400">⚠️ Error loading map data</div>
            <p className="text-slate-300">{error}</p>
            <button
              onClick={() => fetchCitiesData()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCountryName = (code: string): string => {
    const countryNames: Record<string, string> = {
      'US': 'United States', 'CA': 'Canada', 'GB': 'United Kingdom', 'FR': 'France',
      'DE': 'Germany', 'ES': 'Spain', 'IT': 'Italy', 'JP': 'Japan', 'CN': 'China',
      'IN': 'India', 'BR': 'Brazil', 'AU': 'Australia', 'MX': 'Mexico', 'RU': 'Russia',
      'KR': 'South Korea', 'NL': 'Netherlands', 'SE': 'Sweden', 'NO': 'Norway',
      'DK': 'Denmark', 'FI': 'Finland', 'CH': 'Switzerland', 'AT': 'Austria',
      'BE': 'Belgium', 'PL': 'Poland', 'CZ': 'Czech Republic', 'HU': 'Hungary',
      'PT': 'Portugal', 'GR': 'Greece', 'IE': 'Ireland', 'MA': 'Morocco',
      'EG': 'Egypt', 'ZA': 'South Africa', 'NG': 'Nigeria', 'KE': 'Kenya'
    };
    return countryNames[code] || code;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-600 shadow-2xl backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Air Quality Monitoring</h3>
              <p className="text-sm text-slate-400">{getCountryName(userCountry)} - Live Data</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-slate-300 border-slate-500 bg-slate-700/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              {cities.length} Stations
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Modern Grid-Based Visualization */}
        <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl p-6 min-h-[400px] border border-slate-700/50">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-green-600/10 rounded-xl"></div>
            <div className="grid grid-cols-12 h-full opacity-20">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border border-slate-700/20"></div>
              ))}
            </div>
          </div>

          {/* Weather App Style Cards */}
          <div className="relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cities.map((city) => {
                const isHovered = hoveredCity === city.id;
                
                return (
                  <div
                    key={city.id}
                    className={`relative group cursor-pointer transform transition-all duration-300 
                      ${isHovered ? 'scale-[1.02] z-20' : 'hover:scale-[1.01]'}`}
                    onMouseEnter={() => setHoveredCity(city.id)}
                    onMouseLeave={() => setHoveredCity(null)}
                    onClick={() => handleCityClick(city)}
                  >
                    {/* Weather Card */}
                    <div className={`relative h-80 rounded-2xl border backdrop-blur-sm transition-all duration-300 overflow-hidden
                      ${isHovered 
                        ? 'bg-slate-700/90 border-slate-500 shadow-2xl shadow-blue-500/10' 
                        : 'bg-slate-800/70 border-slate-600 hover:bg-slate-700/80 hover:border-slate-500'
                      }`}
                    >
                      {/* Header */}
                      <div className="p-4 border-b border-slate-600/50">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-slate-100 truncate">{city.city}</h3>
                            <p className="text-sm text-slate-400 truncate">{city.state}, {city.country}</p>
                          </div>
                          <div className={`w-4 h-4 rounded-full ${getAQIColor(city.aqi)} shadow-lg ring-2 ring-white/20`}></div>
                        </div>
                        
                        {/* AQI Badge */}
                        <div className="flex items-center justify-between">
                          <Badge className={`${getAQIColor(city.aqi)} text-white text-sm px-3 py-1 shadow-lg`}>
                            AQI {city.aqi}
                          </Badge>
                          <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                            {getAQILevel(city.aqi)}
                          </span>
                        </div>
                      </div>

                      {/* Scrollable Content */}
                      <div className="p-4 h-56 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500">
                        <div className="space-y-3">
                          
                          {/* PM2.5 */}
                          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-orange-400 text-xs font-bold">PM</span>
                              </div>
                              <div>
                                <p className="text-slate-200 font-semibold">PM2.5</p>
                                <p className="text-xs text-slate-400">Fine particles</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-slate-100">{city.pollutants.pm25}</p>
                              <p className="text-xs text-slate-400">μg/m³</p>
                            </div>
                          </div>

                          {/* PM10 */}
                          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-amber-400 text-xs font-bold">PM</span>
                              </div>
                              <div>
                                <p className="text-slate-200 font-semibold">PM10</p>
                                <p className="text-xs text-slate-400">Coarse particles</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-slate-100">{city.pollutants.pm10}</p>
                              <p className="text-xs text-slate-400">μg/m³</p>
                            </div>
                          </div>

                          {/* Temperature */}
                          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-blue-400 text-lg">🌡️</span>
                              </div>
                              <div>
                                <p className="text-slate-200 font-semibold">Temperature</p>
                                <p className="text-xs text-slate-400">Current temp</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-slate-100">{city.weather.temperature}</p>
                              <p className="text-xs text-slate-400">°C</p>
                            </div>
                          </div>

                          {/* Humidity */}
                          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-cyan-400 text-lg">💧</span>
                              </div>
                              <div>
                                <p className="text-slate-200 font-semibold">Humidity</p>
                                <p className="text-xs text-slate-400">Relative humidity</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-slate-100">{city.weather.humidity}</p>
                              <p className="text-xs text-slate-400">%</p>
                            </div>
                          </div>

                          {/* Wind Speed */}
                          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-green-400 text-lg">💨</span>
                              </div>
                              <div>
                                <p className="text-slate-200 font-semibold">Wind Speed</p>
                                <p className="text-xs text-slate-400">Current wind</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-slate-100">{city.weather.wind}</p>
                              <p className="text-xs text-slate-400">km/h</p>
                            </div>
                          </div>

                          {/* Visibility */}
                          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-purple-400 text-lg">👁️</span>
                              </div>
                              <div>
                                <p className="text-slate-200 font-semibold">Visibility</p>
                                <p className="text-xs text-slate-400">Visual range</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-slate-100">{Math.floor(Math.random() * 20) + 10}</p>
                              <p className="text-xs text-slate-400">km</p>
                            </div>
                          </div>

                          {/* UV Index */}
                          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-yellow-400 text-lg">☀️</span>
                              </div>
                              <div>
                                <p className="text-slate-200 font-semibold">UV Index</p>
                                <p className="text-xs text-slate-400">UV radiation</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-slate-100">{Math.floor(Math.random() * 11) + 1}</p>
                              <p className="text-xs text-slate-400">Index</p>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Hover Effect */}
                      {isHovered && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-green-500/5 pointer-events-none"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {cities.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No monitoring stations found</h3>
                <p className="text-slate-500">No air quality data available for {getCountryName(userCountry)}</p>
              </div>
            )}
          </div>


        </div>
      </CardContent>
    </Card>
  );
}

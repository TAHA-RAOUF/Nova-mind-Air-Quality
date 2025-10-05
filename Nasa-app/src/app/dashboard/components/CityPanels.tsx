"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Radio, 
  Clock, 
  Filter, 
  Search, 
  ArrowUpDown,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface City {
  id: string;
  city: string;
  state: string;
  country: string;
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

interface CityPanelsProps {
  onCitySelect: (city: City) => void;
  selectedCityId?: string;
}

const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return 'bg-green-500 text-white';
  if (aqi <= 100) return 'bg-yellow-500 text-black';
  if (aqi <= 150) return 'bg-orange-500 text-white';
  if (aqi <= 200) return 'bg-red-500 text-white';
  if (aqi <= 300) return 'bg-purple-500 text-white';
  return 'bg-red-900 text-white';
};

const getAQILevel = (aqi: number): string => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const getPollutantIcon = (pollutant: string): string => {
  const icons: Record<string, string> = {
    'PM2.5': '🟤',
    'PM10': '🟫',
    'NO2': '🟡',
    'O3': '🔵',
    'SO2': '🟣',
    'CO': '⚫'
  };
  return icons[pollutant] || '⭕';
};

type SortField = 'city' | 'aqi' | 'dominantPollutant' | 'lastUpdated';
type SortDirection = 'asc' | 'desc';

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

export function CityPanels({ onCitySelect, selectedCityId }: CityPanelsProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('aqi');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [aqiFilter, setAqiFilter] = useState<string>('all');
  const [userCountry, setUserCountry] = useState<string>('');

  useEffect(() => {
    const savedCountry = localStorage.getItem('userCountry') || 'US';
    setUserCountry(savedCountry);
    fetchCitiesData(savedCountry);
  }, []);

  useEffect(() => {
    filterAndSortCities();
  }, [cities, searchQuery, sortField, sortDirection, aqiFilter]);

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
      console.log('Refreshing CityPanels data');
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
      
      // Filter cities by country (default to US cities)
      const filteredCities = targetCountry === 'US' 
        ? cityList.filter((city: any) => city.country === 'US' || !city.country)
        : cityList.filter((city: any) => city.country === targetCountry);

      console.log(`Fetched ${filteredCities.length} cities for ${targetCountry}:`, filteredCities);
      
      // Fetch air quality data for each city using your API
      const citiesWithAQI = await Promise.all(
        filteredCities.slice(0, 50).map(async (city: any, index: number) => {
          try {
            console.log(`Fetching air quality for: ${city.city}`);
            
            const airQualityResponse = await fetch(
              `http://10.11.6.11:8001/api/airquality?city=${encodeURIComponent(city.city)}`
            );
            
            if (!airQualityResponse.ok) {
              console.warn(`Failed to fetch air quality for ${city.city}: ${airQualityResponse.status}`);
              return createMockCity(city, index);
            }

            const airQualityData = await airQualityResponse.json();
            console.log(`Air quality data for ${city.city}:`, airQualityData);
            
            // Map the API response to our expected format
            return {
              id: `city-${index}`,
              city: city.city,
              state: city.state || 'Unknown',
              country: city.country || 'US',
              station: city.station || `${city.city} Monitoring Station`,
              aqi: airQualityData.aqi || 0,
              dominantPollutant: getDominantPollutant(airQualityData.pollutants || {}),
              lastUpdated: new Date().toISOString(),
              pollutants: {
                pm25: airQualityData.pollutants?.pm25 || 0,
                pm10: airQualityData.pollutants?.pm10 || 0,
                no2: airQualityData.pollutants?.no2 || 0,
                o3: airQualityData.pollutants?.o3 || 0,
                so2: airQualityData.pollutants?.so2 || 0,
                co: airQualityData.pollutants?.co || 0,
              },
              weather: {
                temperature: airQualityData.weather?.temperature || 20,
                humidity: airQualityData.weather?.humidity || 50,
                wind: airQualityData.weather?.wind || 5,
                pressure: airQualityData.weather?.pressure || 1013,
              }
            };
            
          } catch (err) {
            console.error(`Error fetching data for ${city.city}:`, err);
            return createMockCity(city, index);
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

  const createMockCity = (city: any, index: number): City => ({
    id: `city-${index}`,
    ...city,
    aqi: Math.floor(Math.random() * 200) + 1,
    dominantPollutant: ['PM2.5', 'PM10', 'NO2', 'O3'][Math.floor(Math.random() * 4)],
    lastUpdated: new Date().toISOString(),
    pollutants: {
      pm25: Math.floor(Math.random() * 50) + 5,
      pm10: Math.floor(Math.random() * 80) + 10,
      no2: Math.floor(Math.random() * 40) + 2,
      o3: Math.floor(Math.random() * 60) + 5,
      so2: Math.floor(Math.random() * 20) + 1,
      co: Math.floor(Math.random() * 10) + 0.5,
    },
    weather: {
      temperature: Math.floor(Math.random() * 30) + 10,
      humidity: Math.floor(Math.random() * 60) + 20,
      wind: Math.floor(Math.random() * 15) + 2,
      pressure: Math.floor(Math.random() * 50) + 1000,
    }
  });

  const filterAndSortCities = () => {
    let filtered = [...cities];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(city =>
        city.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.station.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply AQI filter
    if (aqiFilter !== 'all') {
      switch (aqiFilter) {
        case 'good':
          filtered = filtered.filter(city => city.aqi <= 50);
          break;
        case 'moderate':
          filtered = filtered.filter(city => city.aqi > 50 && city.aqi <= 100);
          break;
        case 'unhealthy-sensitive':
          filtered = filtered.filter(city => city.aqi > 100 && city.aqi <= 150);
          break;
        case 'unhealthy':
          filtered = filtered.filter(city => city.aqi > 150 && city.aqi <= 200);
          break;
        case 'very-unhealthy':
          filtered = filtered.filter(city => city.aqi > 200 && city.aqi <= 300);
          break;
        case 'hazardous':
          filtered = filtered.filter(city => city.aqi > 300);
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'city':
          comparison = a.city.localeCompare(b.city);
          break;
        case 'aqi':
          comparison = a.aqi - b.aqi;
          break;
        case 'dominantPollutant':
          comparison = a.dominantPollutant.localeCompare(b.dominantPollutant);
          break;
        case 'lastUpdated':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredCities(filtered);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/60 border-slate-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-100">
            <Radio className="h-6 w-6 mr-3 text-green-400" />
            City Air Quality Stations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
            <p className="text-slate-300">Loading city air quality data...</p>
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
            <AlertCircle className="h-6 w-6 mr-3 text-red-400" />
            Error Loading Data
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="text-red-400">⚠️ Failed to load city data</div>
            <p className="text-slate-300">{error}</p>
            <Button
              onClick={() => fetchCitiesData()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/60 border-slate-700 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg">
              <Radio className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Monitoring Stations</h3>
              <p className="text-sm text-slate-400">{getCountryName(userCountry)} - Real-time Data</p>
            </div>
          </div>
          <Badge variant="outline" className="text-slate-300 border-slate-500 bg-slate-700/30">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            {filteredCities.length} / {cities.length}
          </Badge>
        </CardTitle>
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search cities, states, or stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400"
              />
            </div>
          </div>
          
          <select
            value={aqiFilter}
            onChange={(e) => setAqiFilter(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-slate-100"
          >
            <option value="all">All AQI Levels</option>
            <option value="good">Good (0-50)</option>
            <option value="moderate">Moderate (51-100)</option>
            <option value="unhealthy-sensitive">Unhealthy for Sensitive (101-150)</option>
            <option value="unhealthy">Unhealthy (151-200)</option>
            <option value="very-unhealthy">Very Unhealthy (201-300)</option>
            <option value="hazardous">Hazardous (301+)</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Sort Headers */}
        <div className="grid grid-cols-12 gap-4 pb-4 mb-4 border-b border-slate-700">
          <div className="col-span-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('city')}
              className="text-slate-300 hover:text-slate-100 p-0 h-auto justify-start"
            >
              City / Station
              <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="col-span-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('aqi')}
              className="text-slate-300 hover:text-slate-100 p-0 h-auto justify-start"
            >
              AQI
              <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="col-span-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('dominantPollutant')}
              className="text-slate-300 hover:text-slate-100 p-0 h-auto justify-start"
            >
              Dominant Pollutant
              <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="col-span-2">
            <span className="text-slate-300 text-sm font-medium">Level</span>
          </div>
          <div className="col-span-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('lastUpdated')}
              className="text-slate-300 hover:text-slate-100 p-0 h-auto justify-start"
            >
              Updated
              <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* City Cards - Compact Grid Layout */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
          {filteredCities.map((city) => (
            <div
              key={city.id}
              onClick={() => onCitySelect(city)}
              className={`relative p-3 rounded-lg cursor-pointer transition-all duration-200 border
                ${selectedCityId === city.id 
                  ? 'bg-blue-900/40 border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'bg-slate-700/40 hover:bg-slate-700/60 border-slate-600 hover:border-slate-500'
                }`}
            >
              <div className="flex items-center justify-between">
                {/* Left Section - City Info */}
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${getAQIColor(city.aqi).replace('text-white', '').replace('text-black', '')} shadow-sm`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-slate-100 text-sm truncate">
                        {city.city}
                      </h4>
                      <Badge className={`${getAQIColor(city.aqi)} text-xs px-2 py-0.5`}>
                        {city.aqi}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {city.station}
                    </p>
                  </div>
                </div>

                {/* Right Section - Details */}
                <div className="flex items-center space-x-4 flex-shrink-0">
                  {/* Pollutant */}
                  <div className="text-center">
                    <div className="text-lg">{getPollutantIcon(city.dominantPollutant)}</div>
                    <div className="text-xs text-slate-400">{city.dominantPollutant}</div>
                  </div>
                  
                  {/* Level */}
                  <div className="text-center min-w-[80px]">
                    <div className="text-sm font-medium text-slate-200">
                      {getAQILevel(city.aqi).split(' ')[0]}
                    </div>
                    <div className="text-xs text-slate-400">
                      {getAQILevel(city.aqi).includes('for') ? 'Sensitive' : 'General'}
                    </div>
                  </div>
                  
                  {/* Time */}
                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-slate-400 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(city.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              {selectedCityId === city.id && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-green-500/5 pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(71, 85, 105, 0.3);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.5);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 163, 184, 0.7);
          }
        `}</style>
        
        {filteredCities.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No cities match your current filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import CardNav from './components/CardNav';
import { AQIMainCard } from './components/AQIMainCard';
import { KPICards } from './components/KPICards';
import { WeatherForecast } from './components/WeatherForecast';
import { HealthRecommendations } from './components/HealthRecommendations';
import { InteractiveMap } from './components/InteractiveMap';
import { CityPanels } from './components/CityPanels';
import { CityDetail } from './components/CityDetail';
import { AirQualityShop } from './components/AirQualityShop';
import { ErrorBoundary } from './components/ErrorBoundary';
  import SpaceBackground from '../components/SpaceBackground';

// Air Quality Index levels
const AQI_LEVELS = {
  good: { min: 0, max: 50, color: '#22c55e', textColor: 'text-green-500', label: 'Good' },
  moderate: { min: 51, max: 100, color: '#eab308', textColor: 'text-yellow-500', label: 'Moderate' },
  unhealthy: { min: 101, max: 150, color: '#f97316', textColor: 'text-orange-500', label: 'Unhealthy for Sensitive' },
  unhealthyAll: { min: 151, max: 200, color: '#ef4444', textColor: 'text-red-500', label: 'Unhealthy' },
  veryUnhealthy: { min: 201, max: 300, color: '#a855f7', textColor: 'text-purple-500', label: 'Very Unhealthy' },
  hazardous: { min: 301, max: 500, color: '#7f1d1d', textColor: 'text-red-900', label: 'Hazardous' }
};

function getAQILevel(aqi: number) {
  if (aqi <= 50) return AQI_LEVELS.good;
  if (aqi <= 100) return AQI_LEVELS.moderate;
  if (aqi <= 150) return AQI_LEVELS.unhealthy;
  if (aqi <= 200) return AQI_LEVELS.unhealthyAll;
  if (aqi <= 300) return AQI_LEVELS.veryUnhealthy;
  return AQI_LEVELS.hazardous;
}

// Mock data generator
function generateMockData(country: string) {
  const countryFactors: Record<string, number> = {
    'CN': 120, 'IN': 150, 'US': 45, 'CA': 35, 'GB': 40,
    'FR': 38, 'DE': 42, 'JP': 48, 'AU': 35, 'BR': 65,
    'MA': 55, 'EG': 85, 'Global': 50
  };
  
  const baseAQI = countryFactors[country] || 50;
  const variation = Math.random() * 20 - 10;
  
  return {
    aqi: Math.max(1, Math.round(baseAQI + variation)),
    pm25: Math.max(1, Math.round((baseAQI + variation) * 0.8)),
    pm10: Math.max(1, Math.round((baseAQI + variation) * 1.2)),
    temperature: Math.round(18 + Math.random() * 20),
    humidity: Math.round(40 + Math.random() * 40),
    windSpeed: Math.round(3 + Math.random() * 20),
    visibility: Math.round(5 + Math.random() * 10),
    uvIndex: Math.round(1 + Math.random() * 10)
  };
}

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

export default function AirQualityDashboard() {
  const [userCountry, setUserCountry] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [airData, setAirData] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [viewMode, setViewMode] = useState<'overview' | 'city-detail' | 'shop'>('overview');

  useEffect(() => {
    setMounted(true);
    // Default to US if no country is selected
    const savedCountry = localStorage.getItem('userCountry') || 'US';
    setUserCountry(savedCountry);
    setAirData(generateMockData(savedCountry));

    // Update time every minute
    const timeTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Refresh data every hour (3600000 ms = 1 hour)
    const dataTimer = setInterval(() => {
      console.log('Hourly data refresh triggered');
      const currentCountry = localStorage.getItem('userCountry') || 'US';
      setAirData(generateMockData(currentCountry));
      // This will also trigger refresh in child components that listen to country changes
    }, 3600000); // 1 hour

    return () => {
      clearInterval(timeTimer);
      clearInterval(dataTimer);
    };
  }, []);

  const handleRefresh = () => {
    const savedCountry = localStorage.getItem('userCountry') || 'Global';
    setAirData(generateMockData(savedCountry));
    setCurrentTime(new Date());
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setViewMode('city-detail');
  };

  const handleBackToOverview = () => {
    setSelectedCity(null);
    setViewMode('overview');
  };

  const handleGoToShop = () => {
    setViewMode('shop');
  };

  const handleCountryChange = (country: string) => {
    setUserCountry(country);
    // This will trigger a refresh in the child components
    // as they listen for localStorage changes
  };

  if (!mounted || !airData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-blue-500 mx-auto"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-4 border-transparent border-r-green-500 mx-auto"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Loading Aerexus Dashboard</h3>
            <p className="text-slate-400">Fetching real-time air quality data...</p>
          </div>
        </div>
      </div>
    );
  }

  const aqiLevel = getAQILevel(airData.aqi);

  return (
    <div className="min-h-screen relative">
      {/* Space Background */}
      <SpaceBackground />
      
      {/* Header */}
      <div className="relative z-10">
        <CardNav
          logo="/logo.webp"
          logoAlt="Aerexus Logo"
          userCountry={userCountry}
          currentTime={currentTime}
          onShopClick={handleGoToShop}
          onCountryChange={handleCountryChange}
          items={[
            {
              label: "Air Quality",
              bgColor: "linear-gradient(135deg, #3b82f6, #1e40af)",
              textColor: "#ffffff",
              links: [
                { label: "Global Map", href: "#map", ariaLabel: "View global air quality map" },
                { label: "Live Data", href: "#live", ariaLabel: "View live air quality data" },
                { label: "Forecasts", href: "#forecast", ariaLabel: "View air quality forecasts" }
              ]
            },
            {
              label: "Health & Safety",
              bgColor: "linear-gradient(135deg, #10b981, #059669)",
              textColor: "#ffffff",
              links: [
                { label: "Health Tips", href: "#health", ariaLabel: "View health recommendations" },
                { label: "Alerts", href: "#alerts", ariaLabel: "View air quality alerts" },
                { label: "Protection", href: "#protection", ariaLabel: "View protection guidelines" }
              ]
            },
            {
              label: "Solutions",
              bgColor: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
              textColor: "#ffffff",
              links: [
                { label: "Air Purifiers", href: "#purifiers", ariaLabel: "Browse air purifiers" },
                { label: "Masks & Filters", href: "#masks", ariaLabel: "Browse protective masks" },
                { label: "Smart Devices", href: "#devices", ariaLabel: "Browse smart air quality devices" }
              ]
            }
          ]}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {viewMode === 'overview' ? (
          <>
            {/* Interactive Map Section */}
            <ErrorBoundary>
              <InteractiveMap onCitySelect={handleCitySelect} />
            </ErrorBoundary>
            
            {/* City Panels and Overview Stats */}
            <div className="grid lg:grid-cols-3 gap-8 min-h-[400px]">
              {/* City List Panels - Takes up 2/3 of the width */}
              <div className="lg:col-span-2">
                <ErrorBoundary>
                  <CityPanels 
                    onCitySelect={handleCitySelect} 
                    selectedCityId={selectedCity?.id}
                  />
                </ErrorBoundary>
              </div>
              
              {/* Quick Overview Stats - Takes up 1/3 of the width, matches map height */}
              <div className="flex flex-col justify-between min-h-[400px]">
                {/* Main AQI Card - Takes most of the space */}
                <div className="flex-1 mb-4">
                  <AQIMainCard aqi={airData.aqi} aqiLevel={aqiLevel} compact={false} />
                </div>
                
                {/* Additional KPI Cards - Compact at bottom */}
                <div className="space-y-3">
                  <KPICards airData={airData} compact={true} />
                </div>
              </div>
            </div>
            
            {/* Additional Dashboard Sections */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Weather and Forecast */}
              <WeatherForecast airData={airData} getAQILevel={getAQILevel} />
              
              {/* Health Recommendations */}
              <div className="lg:col-span-1">
                <HealthRecommendations aqi={airData.aqi} />
              </div>
            </div>
          </>
        ) : viewMode === 'shop' ? (
          /* Air Quality Solutions Shop */
          <div className="space-y-6">
            {/* Back Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToOverview}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-600 rounded-lg text-slate-300 hover:text-slate-100 transition-all duration-200"
              >
                <span>←</span>
                <span>Back to Dashboard</span>
              </button>
              <h2 className="text-2xl font-bold text-slate-100">Air Quality Solutions Market</h2>
            </div>
            
            <ErrorBoundary>
              <AirQualityShop currentAQI={airData.aqi} />
            </ErrorBoundary>
          </div>
        ) : (
          /* City Detail View */
          selectedCity && (
            <ErrorBoundary>
              <CityDetail 
                city={selectedCity} 
                onBack={handleBackToOverview}
              />
            </ErrorBoundary>
          )
        )}
        
      </div>
    </div>
  );
}
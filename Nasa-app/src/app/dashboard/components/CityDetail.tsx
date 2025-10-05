"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Radio,
  Heart,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Activity,
  TrendingUp,
  ArrowLeft,
  AlertTriangle,
  Stethoscope,
  Baby,
  Shield,
  Eye
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

interface CityDetailProps {
  city: City;
  onBack: () => void;
}

const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return 'bg-green-500 text-white border-green-400';
  if (aqi <= 100) return 'bg-yellow-500 text-black border-yellow-400';
  if (aqi <= 150) return 'bg-orange-500 text-white border-orange-400';
  if (aqi <= 200) return 'bg-red-500 text-white border-red-400';
  if (aqi <= 300) return 'bg-purple-500 text-white border-purple-400';
  return 'bg-red-900 text-white border-red-700';
};

const getAQILevel = (aqi: number): string => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const getHealthCommentary = (aqi: number, userType: string = 'general'): string => {
  // This would be provided by Hiba's mapping system
  const commentaries: Record<string, Record<string, string>> = {
    'heart_disease': {
      'good': 'Air quality is excellent for people with heart conditions. Safe for all outdoor activities.',
      'moderate': 'Generally acceptable, but consider limiting prolonged outdoor exertion if you experience symptoms.',
      'unhealthy_sensitive': 'Reduce outdoor activities. Consider staying indoors during peak hours. Monitor symptoms closely.',
      'unhealthy': 'Avoid outdoor activities. Stay indoors and use air purifiers. Consult your doctor if symptoms worsen.',
      'very_unhealthy': 'Emergency precautions needed. Avoid going outside. Seek immediate medical attention for any symptoms.',
      'hazardous': 'Extreme danger. Do not go outside. Emergency medical consultation recommended.'
    },
    'asthma': {
      'good': 'Excellent conditions for people with asthma. All activities are safe.',
      'moderate': 'Generally safe, but keep rescue inhaler nearby during outdoor activities.',
      'unhealthy_sensitive': 'High risk for asthma attacks. Stay indoors and avoid outdoor exercise.',
      'unhealthy': 'Very high risk. Avoid outdoor exposure. Use medications as prescribed by doctor.',
      'very_unhealthy': 'Emergency risk level. Stay indoors with air filtration. Have emergency medications ready.',
      'hazardous': 'Life-threatening conditions. Seek emergency medical care for any breathing difficulties.'
    },
    'pregnant': {
      'good': 'Safe air quality for pregnant women and developing babies.',
      'moderate': 'Generally safe, but limit prolonged outdoor activities during peak pollution hours.',
      'unhealthy_sensitive': 'Increased risk to fetal development. Stay indoors when possible.',
      'unhealthy': 'Significant risk to pregnancy. Avoid outdoor exposure and consult your doctor.',
      'very_unhealthy': 'High risk to maternal and fetal health. Stay indoors and seek medical advice.',
      'hazardous': 'Emergency conditions. Seek immediate medical consultation.'
    },
    'general': {
      'good': 'Air quality is satisfactory and poses little or no risk to health.',
      'moderate': 'Air quality is acceptable for most people, but sensitive individuals should limit outdoor activities.',
      'unhealthy_sensitive': 'Members of sensitive groups may experience health effects. General public less likely to be affected.',
      'unhealthy': 'Everyone may begin to experience health effects. Sensitive groups may experience more serious effects.',
      'very_unhealthy': 'Health alert: everyone may experience serious health effects.',
      'hazardous': 'Emergency conditions: entire population more likely to be affected by serious health effects.'
    }
  };

  const level = aqi <= 50 ? 'good' : aqi <= 100 ? 'moderate' : aqi <= 150 ? 'unhealthy_sensitive' : 
                aqi <= 200 ? 'unhealthy' : aqi <= 300 ? 'very_unhealthy' : 'hazardous';
  
  return commentaries[userType]?.[level] || commentaries['general'][level];
};

const getHealthRecommendations = (aqi: number, userType: string = 'general'): string => {
  // This would be provided by Hiba's mapping system
  const recommendations: Record<string, Record<string, string>> = {
    'heart_disease': {
      'good': 'Normal activities are safe. Great time for outdoor exercise and fresh air.',
      'moderate': 'Take breaks during extended outdoor activities. Stay hydrated.',
      'unhealthy_sensitive': 'Limit outdoor time to essential activities. Use N95 masks when outside.',
      'unhealthy': 'Stay indoors. Use air purifiers. Take prescribed medications as needed.',
      'very_unhealthy': 'Remain indoors with air filtration. Contact your cardiologist if experiencing symptoms.',
      'hazardous': 'Emergency indoor shelter. Have emergency medications ready. Contact emergency services if needed.'
    },
    'asthma': {
      'good': 'Perfect conditions for all activities. Enjoy outdoor time safely.',
      'moderate': 'Carry rescue inhaler. Avoid intense outdoor exercise during peak hours.',
      'unhealthy_sensitive': 'Stay indoors. Keep rescue medications accessible. Use air purifiers.',
      'unhealthy': 'Strict indoor stay. Pre-medicate as prescribed. Monitor peak flow readings.',
      'very_unhealthy': 'Emergency protocols. Have nebulizer ready. Contact healthcare provider.',
      'hazardous': 'Life safety mode. Emergency medication access. Call 911 for breathing difficulties.'
    },
    'pregnant': {
      'good': 'Safe for all prenatal activities and gentle exercise outdoors.',
      'moderate': 'Limit strenuous outdoor activities. Stay in well-ventilated areas.',
      'unhealthy_sensitive': 'Minimize outdoor exposure. Focus on indoor prenatal activities.',
      'unhealthy': 'Stay indoors. Use air purifiers. Consult your obstetrician about precautions.',
      'very_unhealthy': 'Strict indoor protocols. Contact prenatal care provider for guidance.',
      'hazardous': 'Emergency indoor shelter. Immediate medical consultation if experiencing symptoms.'
    },
    'general': {
      'good': 'Great day for outdoor activities, exercise, and spending time outside.',
      'moderate': 'Good for most activities. Sensitive people should monitor symptoms.',
      'unhealthy_sensitive': 'Reduce outdoor activities. Wear masks when outside is necessary.',
      'unhealthy': 'Limit outdoor exposure. Wear N95 masks. Use air purifiers indoors.',
      'very_unhealthy': 'Stay indoors. Avoid outdoor activities. Use high-quality air filtration.',
      'hazardous': 'Emergency conditions. Remain indoors. Seek shelter with air filtration.'
    }
  };

  const level = aqi <= 50 ? 'good' : aqi <= 100 ? 'moderate' : aqi <= 150 ? 'unhealthy_sensitive' : 
                aqi <= 200 ? 'unhealthy' : aqi <= 300 ? 'very_unhealthy' : 'hazardous';
  
  return recommendations[userType]?.[level] || recommendations['general'][level];
};

const pollutantInfo = {
  pm25: { name: 'PM2.5', unit: 'μg/m³', icon: '🟤', description: 'Fine particulate matter (≤2.5 micrometers)' },
  pm10: { name: 'PM10', unit: 'μg/m³', icon: '🟫', description: 'Coarse particulate matter (≤10 micrometers)' },
  no2: { name: 'NO2', unit: 'ppb', icon: '🟡', description: 'Nitrogen Dioxide - Traffic and industrial pollution' },
  o3: { name: 'O3', unit: 'ppb', icon: '🔵', description: 'Ozone - Ground-level ozone (smog)' },
  so2: { name: 'SO2', unit: 'ppb', icon: '🟣', description: 'Sulfur Dioxide - Industrial emissions' },
  co: { name: 'CO', unit: 'ppm', icon: '⚫', description: 'Carbon Monoxide - Vehicle exhaust, combustion' }
};

export function CityDetail({ city, onBack }: CityDetailProps) {
  // Mock 7-day forecast data
  const forecastData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      aqi: city.aqi + Math.floor(Math.random() * 40 - 20),
      temp: city.weather.temperature + Math.floor(Math.random() * 10 - 5)
    };
  });

  // Mock 24-hour history data
  const historyData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() - (23 - i));
    return {
      time: hour.getHours() + ':00',
      aqi: city.aqi + Math.floor(Math.random() * 30 - 15)
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-800/60 border-slate-700 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-slate-300 hover:text-slate-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="text-sm text-slate-400">
              Last Updated: {new Date(city.lastUpdated).toLocaleString()}
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-blue-400" />
                <h1 className="text-3xl font-bold text-slate-100">{city.city}</h1>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Radio className="h-4 w-4" />
                <span>{city.station}</span>
                <span>•</span>
                <span>{city.state}, {city.country}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <Badge className={`text-2xl px-4 py-2 ${getAQIColor(city.aqi)}`}>
                  AQI {city.aqi}
                </Badge>
                <div className="text-slate-300 text-sm mt-1">
                  {getAQILevel(city.aqi)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-slate-200">
                  {pollutantInfo[city.dominantPollutant.toLowerCase().replace('.', '') as keyof typeof pollutantInfo]?.icon || '⭕'}
                </div>
                <div className="text-slate-400 text-sm">
                  Dominant: {city.dominantPollutant}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Health Commentary & Recommendations */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/60 border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-100">
              <Heart className="h-5 w-5 mr-2 text-red-400" />
              Health Commentary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h4 className="font-semibold text-slate-200 mb-2">General Population</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {getHealthCommentary(city.aqi, 'general')}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-red-900/20 rounded-lg border border-red-700/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="h-4 w-4 text-red-400" />
                    <span className="text-xs font-medium text-red-300">Heart Disease</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-tight">
                    {getHealthCommentary(city.aqi, 'heart_disease')}
                  </p>
                </div>
                
                <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-700/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Stethoscope className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-medium text-blue-300">Asthma</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-tight">
                    {getHealthCommentary(city.aqi, 'asthma')}
                  </p>
                </div>
                
                <div className="p-3 bg-pink-900/20 rounded-lg border border-pink-700/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Baby className="h-4 w-4 text-pink-400" />
                    <span className="text-xs font-medium text-pink-300">Pregnancy</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-tight">
                    {getHealthCommentary(city.aqi, 'pregnant')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-100">
              <Shield className="h-5 w-5 mr-2 text-green-400" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-900/20 rounded-lg border border-green-700/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="font-medium text-green-300">General Guidance</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {getHealthRecommendations(city.aqi, 'general')}
                </p>
              </div>

              {city.aqi > 100 && (
                <div className="p-3 bg-orange-900/20 rounded-lg border border-orange-700/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                    <span className="font-medium text-orange-300">Special Precautions</span>
                  </div>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Wear N95 or equivalent masks outdoors</li>
                    <li>• Use air purifiers indoors</li>
                    <li>• Keep windows closed</li>
                    <li>• Limit outdoor exercise</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pollutants & Weather */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pollutants Panel */}
        <Card className="bg-slate-800/60 border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-100">
              <Activity className="h-5 w-5 mr-2 text-purple-400" />
              Current Pollutant Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(city.pollutants).map(([key, value]) => {
                const info = pollutantInfo[key as keyof typeof pollutantInfo];
                return (
                  <div key={key} className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{info.icon}</span>
                      <span className="font-semibold text-slate-200">{info.name}</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-100">
                      {typeof value === 'number' ? value.toFixed(1) : value}
                      <span className="text-sm text-slate-400 ml-1">{info.unit}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {info.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Weather Panel */}
        <Card className="bg-slate-800/60 border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-100">
              <Thermometer className="h-5 w-5 mr-2 text-orange-400" />
              Current Weather Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Thermometer className="h-4 w-4 text-orange-400" />
                  <span className="font-semibold text-slate-200">Temperature</span>
                </div>
                <div className="text-2xl font-bold text-slate-100">
                  {city.weather.temperature}°<span className="text-sm text-slate-400">C</span>
                </div>
              </div>

              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Droplets className="h-4 w-4 text-cyan-400" />
                  <span className="font-semibold text-slate-200">Humidity</span>
                </div>
                <div className="text-2xl font-bold text-slate-100">
                  {city.weather.humidity}<span className="text-sm text-slate-400">%</span>
                </div>
              </div>

              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Wind className="h-4 w-4 text-green-400" />
                  <span className="font-semibold text-slate-200">Wind Speed</span>
                </div>
                <div className="text-2xl font-bold text-slate-100">
                  {city.weather.wind}<span className="text-sm text-slate-400"> m/s</span>
                </div>
              </div>

              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Gauge className="h-4 w-4 text-indigo-400" />
                  <span className="font-semibold text-slate-200">Pressure</span>
                </div>
                <div className="text-2xl font-bold text-slate-100">
                  {city.weather.pressure}<span className="text-sm text-slate-400"> hPa</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast & History */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 7-Day Forecast */}
        <Card className="bg-slate-800/60 border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-100">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
              7-Day AQI Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {forecastData.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-200 font-medium w-20">{day.date}</span>
                    <Badge className={`${getAQIColor(day.aqi)} text-sm`}>
                      {day.aqi}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Thermometer className="h-4 w-4" />
                    <span>{day.temp}°C</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 24-Hour History */}
        <Card className="bg-slate-800/60 border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-100">
              <Activity className="h-5 w-5 mr-2 text-green-400" />
              24-Hour AQI History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-6 gap-2">
                {historyData.slice(-12).map((hour, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-slate-400 mb-1">{hour.time}</div>
                    <div className={`w-full h-8 rounded flex items-center justify-center text-xs font-bold ${getAQIColor(hour.aqi)}`}>
                      {hour.aqi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

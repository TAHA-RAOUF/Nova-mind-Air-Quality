"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wind, CloudRain, Sun, Cloud, Eye } from 'lucide-react';

interface AirData {
  aqi: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
}

interface WeatherForecastProps {
  airData: AirData;
  getAQILevel: (aqi: number) => { textColor: string };
}

export function WeatherForecast({ airData, getAQILevel }: WeatherForecastProps) {
  const forecastData = [
    { time: '12:00', aqi: airData.aqi + 5, condition: 'Partly Cloudy', temp: 24 },
    { time: '15:00', aqi: airData.aqi - 3, condition: 'Clear', temp: 27 },
    { time: '18:00', aqi: airData.aqi + 8, condition: 'Cloudy', temp: 25 },
    { time: '21:00', aqi: airData.aqi - 2, condition: 'Clear', temp: 22 }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Current Weather Conditions */}
      <Card className="bg-slate-800/60 border-slate-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-bold text-slate-100">
            <Wind className="h-6 w-6 mr-3 text-blue-400" />
            Weather Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Wind className="h-5 w-5 text-blue-400" />
                <span className="font-medium text-slate-300">Wind Speed</span>
              </div>
              <span className="text-xl font-bold text-slate-100">{airData.windSpeed} km/h</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-indigo-400" />
                <span className="font-medium text-slate-300">Visibility</span>
              </div>
              <span className="text-xl font-bold text-slate-100">{airData.visibility} km</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Sun className="h-5 w-5 text-yellow-400" />
                <span className="font-medium text-slate-300">UV Index</span>
              </div>
              <Badge 
                variant={airData.uvIndex > 6 ? "destructive" : airData.uvIndex > 3 ? "default" : "secondary"}
                className="text-lg px-3 py-1"
              >
                {airData.uvIndex}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 24H Forecast */}
      <Card className="bg-slate-800/60 border-slate-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-bold text-slate-100">
            <CloudRain className="h-6 w-6 mr-3 text-green-400" />
            24H Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forecastData.map((forecast, index) => (
              <div key={index}>
                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-slate-300 w-16">{forecast.time}</span>
                    <div className="flex items-center space-x-2">
                      {forecast.condition === 'Clear' ? (
                        <Sun className="h-5 w-5 text-yellow-400" />
                      ) : forecast.condition === 'Partly Cloudy' ? (
                        <div className="relative">
                          <Cloud className="h-5 w-5 text-slate-400" />
                          <Sun className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
                        </div>
                      ) : (
                        <Cloud className="h-5 w-5 text-slate-400" />
                      )}
                      <span className="text-sm text-slate-300 font-medium">{forecast.condition}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-slate-100">{forecast.temp}°C</span>
                    <Badge 
                      variant="outline" 
                      className={`${getAQILevel(forecast.aqi).textColor} border-current`}
                    >
                      AQI {forecast.aqi}
                    </Badge>
                  </div>
                </div>
                {index < forecastData.length - 1 && <Separator className="my-2 bg-slate-700" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Thermometer, Droplets, Wind, Eye, Sun } from 'lucide-react';

interface AirData {
  pm25: number;
  pm10: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
}

interface KPICardsProps {
  airData: AirData;
  compact?: boolean;
}

const kpiConfig = [
  {
    key: 'pm25',
    title: 'PM2.5',
    icon: Cloud,
    unit: 'μg/m³',
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/30',
    description: 'Fine particles'
  },
  {
    key: 'pm10',
    title: 'PM10',
    icon: Cloud,
    unit: 'μg/m³',
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/30',
    description: 'Coarse particles'
  },
  {
    key: 'temperature',
    title: 'Temperature',
    icon: Thermometer,
    unit: '°C',
    color: 'text-orange-400',
    bgColor: 'bg-orange-900/30',
    description: 'Current temp'
  },
  {
    key: 'humidity',
    title: 'Humidity',
    icon: Droplets,
    unit: '%',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-900/30',
    description: 'Relative humidity'
  },
  {
    key: 'windSpeed',
    title: 'Wind Speed',
    icon: Wind,
    unit: 'km/h',
    color: 'text-green-400',
    bgColor: 'bg-green-900/30',
    description: 'Current wind'
  },
  {
    key: 'visibility',
    title: 'Visibility',
    icon: Eye,
    unit: 'km',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-900/30',
    description: 'Visual range'
  },
  {
    key: 'uvIndex',
    title: 'UV Index',
    icon: Sun,
    unit: '',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-900/30',
    description: 'UV radiation'
  }
];

export function KPICards({ airData, compact = false }: KPICardsProps) {
  // Show only key metrics in compact mode
  const displayConfig = compact 
    ? kpiConfig.slice(0, 4) // Show PM2.5, PM10, Temperature, Humidity
    : kpiConfig;

  return (
    <div className={compact 
      ? "grid grid-cols-2 gap-2" 
      : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    }>
      {displayConfig.map((kpi) => {
        const IconComponent = kpi.icon;
        const value = airData[kpi.key as keyof AirData];
        
        return (
          <Card key={kpi.key} className={`bg-slate-800/60 border-slate-700 hover:shadow-lg hover:bg-slate-800/80 transition-all duration-300 shadow-md ${
            compact ? 'min-h-0' : ''
          }`}>
            <CardHeader className={compact ? "pb-1 pt-3 px-3" : "pb-3"}>
              <div className="flex items-center justify-between">
                <CardTitle className={`font-medium text-slate-300 ${
                  compact ? 'text-xs' : 'text-sm'
                }`}>
                  {kpi.title}
                </CardTitle>
                <div className={`rounded-lg ${kpi.bgColor} ${
                  compact ? 'p-1' : 'p-2'
                }`}>
                  <IconComponent className={`${kpi.color} ${
                    compact ? 'h-3 w-3' : 'h-4 w-4'
                  }`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className={compact ? "pt-0 pb-3 px-3" : "pt-0"}>
              <div className={compact ? "space-y-1" : "space-y-2"}>
                <div className="flex items-baseline space-x-1">
                  <span className={`font-bold text-slate-100 ${
                    compact ? 'text-xl' : 'text-3xl'
                  }`}>
                    {value}
                  </span>
                  <span className={`text-slate-400 font-medium ${
                    compact ? 'text-xs' : 'text-sm'
                  }`}>
                    {kpi.unit}
                  </span>
                </div>
                {!compact && (
                  <p className="text-xs text-slate-400">
                    {kpi.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

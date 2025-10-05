"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AQILevel {
  min: number;
  max: number;
  color: string;
  textColor: string;
  label: string;
}

interface AQIMainCardProps {
  aqi: number;
  aqiLevel: AQILevel;
  compact?: boolean;
}

export function AQIMainCard({ aqi, aqiLevel, compact = false }: AQIMainCardProps) {
  const pollutants = {
    PM25: Math.floor(aqi * 0.6 + Math.random() * 10),
    PM10: Math.floor(aqi * 0.8 + Math.random() * 15),
    NO2: Math.floor(aqi * 0.4 + Math.random() * 8),
    O3: Math.floor(aqi * 0.5 + Math.random() * 12)
  };

  const getHealthMessage = (aqi: number) => {
    if (aqi <= 50) {
      return "Air quality is satisfactory, and air pollution poses little or no risk.";
    } else if (aqi <= 100) {
      return "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.";
    } else if (aqi <= 150) {
      return "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
    } else if (aqi <= 200) {
      return "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.";
    } else {
      return "Health alert: The risk of health effects is increased for everyone. Avoid outdoor activities.";
    }
  };

  return (
    <Card className={`${compact ? '' : 'col-span-2'} bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-xl`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-900/50 rounded-lg">
              <Activity className="h-5 w-5 text-blue-400" />
            </div>
            <span>Air Quality Index</span>
          </div>
          <Badge className={cn("text-sm font-bold px-3 py-1", aqiLevel.color, aqiLevel.textColor)}>
            {aqiLevel.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main AQI Display */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-6xl font-bold text-slate-100">
              {aqi}
            </div>
            <div className="text-lg text-slate-300 mt-2">
              Current Air Quality Index
            </div>
          </div>
          
          {/* AQI Scale */}
          <div className="space-y-3">
            <Progress value={(aqi / 300) * 100} className="h-3 bg-slate-700" />
            <div className="flex justify-between text-xs text-slate-400 px-1">
              <span>Good (0-50)</span>
              <span>Moderate (51-100)</span>
              <span>Unhealthy (101-200)</span>
              <span>Hazardous (201+)</span>
            </div>
          </div>
        </div>

        {/* Pollutant Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(pollutants).map(([key, value]) => (
            <div key={key} className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
              <div className="text-sm text-slate-300 uppercase tracking-wide">
                {key}
              </div>
              <div className="text-xl font-bold text-slate-100 mt-1">
                {value}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                μg/m³
              </div>
            </div>
          ))}
        </div>

        {/* Health Impact */}
        <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 rounded-lg p-4 border border-blue-700/50">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-100 mb-2">Health Impact</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {getHealthMessage(aqi)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

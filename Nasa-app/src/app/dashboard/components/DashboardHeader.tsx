"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, RefreshCw, Activity, Wifi } from 'lucide-react';
import { CountrySettings } from './CountrySettings';

interface DashboardHeaderProps {
  userCountry: string;
  currentTime: Date;
  onRefresh: () => void;
  onCountryChange?: (country: string) => void;
  onGoToShop?: () => void;
}

const countryFlags: Record<string, string> = {
  'US': '🇺🇸', 'CA': '🇨🇦', 'GB': '🇬🇧', 'FR': '🇫🇷', 'DE': '🇩🇪',
  'ES': '🇪🇸', 'IT': '🇮🇹', 'JP': '🇯🇵', 'CN': '🇨🇳', 'IN': '🇮🇳',
  'BR': '🇧🇷', 'AU': '🇦🇺', 'MX': '🇲🇽', 'RU': '🇷🇺', 'MA': '🇲🇦'
};

export function DashboardHeader({ userCountry, currentTime, onRefresh, onCountryChange, onGoToShop }: DashboardHeaderProps) {
  const getCountryFlag = (country: string) => {
    return countryFlags[country] || '🌍';
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 px-6 py-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          
          {/* Title and Location */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-green-400 to-blue-300 bg-clip-text text-transparent">
              Aerexus 
            </h1>
            <div className="flex items-center space-x-6 text-slate-300">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-400" />
                <Badge variant="outline" className="text-base px-3 py-1 font-medium border-slate-600 text-slate-200">
                  {getCountryFlag(userCountry)} {userCountry || 'Global'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-medium">
                  {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Badge className="bg-green-900/50 text-green-300 border-green-700 px-3 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Live Data</span>
              </div>
            </Badge>
            
            {/* Shop Button */}
            {onGoToShop && (
              <Button
                onClick={onGoToShop}
                className="bg-gradient-to-r from-black-600 to-blue-600  text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                size="sm"
              >
                🛒 Shop Solutions
              </Button>
            )}
            
            {/* Country Settings Component */}
            {onCountryChange && (
              <CountrySettings
                currentCountry={userCountry}
                onCountryChange={onCountryChange}
                onRefresh={onRefresh}
              />
            )}
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Wifi className="h-4 w-4 text-green-400" />
              <span>Connected</span>
            </div>
            <span>•</span>
            <span>Data refreshed every 1 hours</span>
          </div>
          <div className="hidden md:block">
            <span>Powered by Aerexus Environmental Network</span>
          </div>
        </div>
      </div>
    </div>
  );
}

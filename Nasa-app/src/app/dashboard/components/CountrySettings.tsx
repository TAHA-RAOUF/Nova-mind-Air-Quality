"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Settings, MapPin, RefreshCw } from 'lucide-react';

interface CountrySettingsProps {
  currentCountry: string;
  onCountryChange: (country: string) => void;
  onRefresh: () => void;
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

const getCountryFlag = (code: string): string => {
  const flags: Record<string, string> = {
    'US': '🇺🇸', 'CA': '🇨🇦', 'GB': '🇬🇧', 'FR': '🇫🇷', 'DE': '🇩🇪',
    'ES': '🇪🇸', 'IT': '🇮🇹', 'JP': '🇯🇵', 'CN': '🇨🇳', 'IN': '🇮🇳',
    'BR': '🇧🇷', 'AU': '🇦🇺', 'MX': '🇲🇽', 'RU': '🇷🇺', 'KR': '🇰🇷',
    'NL': '🇳🇱', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮',
    'CH': '🇨🇭', 'AT': '🇦🇹', 'BE': '🇧🇪', 'PL': '🇵🇱', 'CZ': '🇨🇿',
    'HU': '🇭🇺', 'PT': '🇵🇹', 'GR': '🇬🇷', 'IE': '🇮🇪', 'MA': '🇲🇦',
    'EG': '🇪🇬', 'ZA': '🇿🇦', 'NG': '🇳🇬', 'KE': '🇰🇪'
  };
  return flags[code] || '🌍';
};

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'AU', name: 'Australia' },
  { code: 'MX', name: 'Mexico' },
  { code: 'RU', name: 'Russia' },
  { code: 'KR', name: 'South Korea' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
  { code: 'IE', name: 'Ireland' },
  { code: 'MA', name: 'Morocco' },
  { code: 'EG', name: 'Egypt' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' }
];

export function CountrySettings({ currentCountry, onCountryChange, onRefresh }: CountrySettingsProps) {
  const [selectedCountry, setSelectedCountry] = useState(currentCountry);
  const [isOpen, setIsOpen] = useState(false);

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    localStorage.setItem('userCountry', countryCode);
    onCountryChange(countryCode);
    onRefresh();
    setIsOpen(false);
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Current Country Display */}
      <Badge 
        variant="outline" 
        className="text-slate-300 border-slate-600 bg-slate-700/30 px-3 py-2"
      >
        <MapPin className="h-4 w-4 mr-2 text-blue-400" />
        {getCountryFlag(currentCountry)} {getCountryName(currentCountry)}
      </Badge>

      {/* Refresh Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>

      {/* Country Selection Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
          >
            <Settings className="h-4 w-4 mr-2" />
            Change Region
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-slate-900/95 border-slate-700 backdrop-blur-md">
          <SheetHeader>
            <SheetTitle className="text-slate-100 flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-400" />
              <span>Select Your Region</span>
            </SheetTitle>
            <SheetDescription className="text-slate-400">
              Choose your country to view local air quality monitoring stations and data.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {/* Current Selection */}
            <div className="p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
              <div className="text-sm font-medium text-blue-300 mb-1">Currently Selected</div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getCountryFlag(currentCountry)}</span>
                <span className="text-slate-100 font-semibold">{getCountryName(currentCountry)}</span>
              </div>
            </div>

            {/* Country Grid */}
            <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto custom-scrollbar">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleCountrySelect(country.code)}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 border
                    ${currentCountry === country.code
                      ? 'bg-blue-900/50 border-blue-600 text-blue-300'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/70 hover:border-slate-600'
                    }`}
                >
                  <span className="text-xl">{getCountryFlag(country.code)}</span>
                  <span className="font-medium">{country.name}</span>
                  {currentCountry === country.code && (
                    <Badge className="ml-auto bg-blue-600 text-white text-xs">
                      Current
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-xs text-slate-400">
              💡 <strong>Tip:</strong> Air quality data availability varies by region. 
              Some countries may have limited monitoring stations.
            </div>
          </div>

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
        </SheetContent>
      </Sheet>
    </div>
  );
}

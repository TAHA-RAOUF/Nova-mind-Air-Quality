"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Moon, 
  Sun, 
  Bell, 
  Settings, 
  User, 
  ChevronRight,
  Globe,
  MapPin 
} from 'lucide-react';
import styles from '../style/dashboard.module.css';

interface HeaderProps {
  userCountry?: string;
}

export default function Header({ userCountry }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications] = useState(3); // Mock notification count

  const getCountryFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
      'US': '🇺🇸', 'CA': '🇨🇦', 'GB': '🇬🇧', 'FR': '🇫🇷', 
      'DE': '🇩🇪', 'ES': '🇪🇸', 'IT': '🇮🇹', 'JP': '🇯🇵',
      'CN': '🇨🇳', 'IN': '🇮🇳', 'BR': '🇧🇷', 'AU': '🇦🇺',
      'MX': '🇲🇽', 'RU': '🇷🇺', 'KR': '🇰🇷', 'NL': '🇳🇱',
      'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮',
      'CH': '🇨🇭', 'AT': '🇦🇹', 'BE': '🇧🇪', 'PL': '🇵🇱',
      'CZ': '🇨🇿', 'HU': '🇭🇺', 'PT': '🇵🇹', 'GR': '🇬🇷',
      'IE': '🇮🇪', 'MA': '🇲🇦', 'EG': '🇪🇬', 'ZA': '🇿🇦',
      'NG': '🇳🇬', 'KE': '🇰🇪', 'TH': '🇹🇭', 'VN': '🇻🇳',
      'PH': '🇵🇭', 'ID': '🇮🇩', 'MY': '🇲🇾', 'SG': '🇸🇬',
      'NZ': '🇳🇿', 'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴',
      'PE': '🇵🇪', 'VE': '🇻🇪', 'TR': '🇹🇷', 'SA': '🇸🇦',
      'AE': '🇦🇪', 'IL': '🇮🇱', 'PK': '🇵🇰', 'BD': '🇧🇩',
      'LK': '🇱🇰'
    };
    return flags[countryCode] || '🌍';
  };

  const getCountryName = (countryCode: string) => {
    const countries: Record<string, string> = {
      'US': 'United States', 'CA': 'Canada', 'GB': 'United Kingdom', 
      'FR': 'France', 'DE': 'Germany', 'ES': 'Spain', 'IT': 'Italy',
      'JP': 'Japan', 'CN': 'China', 'IN': 'India', 'BR': 'Brazil',
      'AU': 'Australia', 'MX': 'Mexico', 'RU': 'Russia', 'KR': 'South Korea',
      'NL': 'Netherlands', 'SE': 'Sweden', 'NO': 'Norway', 'DK': 'Denmark',
      'FI': 'Finland', 'CH': 'Switzerland', 'AT': 'Austria', 'BE': 'Belgium',
      'PL': 'Poland', 'CZ': 'Czech Republic', 'HU': 'Hungary', 'PT': 'Portugal',
      'GR': 'Greece', 'IE': 'Ireland', 'MA': 'Morocco', 'EG': 'Egypt',
      'ZA': 'South Africa', 'NG': 'Nigeria', 'KE': 'Kenya', 'TH': 'Thailand',
      'VN': 'Vietnam', 'PH': 'Philippines', 'ID': 'Indonesia', 'MY': 'Malaysia',
      'SG': 'Singapore', 'NZ': 'New Zealand', 'AR': 'Argentina', 'CL': 'Chile',
      'CO': 'Colombia', 'PE': 'Peru', 'VE': 'Venezuela', 'TR': 'Turkey',
      'SA': 'Saudi Arabia', 'AE': 'United Arab Emirates', 'IL': 'Israel',
      'PK': 'Pakistan', 'BD': 'Bangladesh', 'LK': 'Sri Lanka'
    };
    return countries[countryCode] || countryCode;
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 backdrop-blur-sm">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-slate-400" />
          <span className="text-slate-400">Overview</span>
        </div>
        <ChevronRight className="h-3 w-3 text-slate-500" />
        <span className="text-slate-300">Air Quality Monitor</span>
        <ChevronRight className="h-3 w-3 text-slate-500" />
        <div className="flex items-center space-x-2">
          {userCountry && <MapPin className="h-4 w-4 text-blue-400" />}
          <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 border-blue-700/50">
            {userCountry ? (
              <span className="flex items-center gap-1">
                {getCountryFlag(userCountry)} {getCountryName(userCountry)} Dashboard
              </span>
            ) : (
              <span className="flex items-center gap-1">
                🌍 Global Dashboard
              </span>
            )}
          </Badge>
        </div>
      </nav>

      {/* Right side controls */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
          <Button
            variant={!isDarkMode ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsDarkMode(false)}
            className="h-8 px-3 text-xs"
          >
            <Sun className="h-3 w-3 mr-1" />
            Light
          </Button>
          <Button
            variant={isDarkMode ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsDarkMode(true)}
            className="h-8 px-3 text-xs"
          >
            <Moon className="h-3 w-3 mr-1" />
            Dark
          </Button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="sm" className="relative p-2 h-9 w-9">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {notifications}
              </Badge>
            )}
          </Button>
        </div>

        {/* Settings */}
        <Button variant="ghost" size="sm" className="p-2 h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>

        {/* User Profile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 h-auto">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-200">Welcome back!</p>
                <p className="text-xs text-slate-400">Aerexus User</p>
              </div>
              <Avatar className="h-8 w-8 border-2 border-slate-600">
                <AvatarImage src="/avatar.svg" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatar.svg" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                User Profile
              </SheetTitle>
              <SheetDescription>
                Manage your account settings and preferences
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Location Settings</h4>
                <p className="text-xs text-muted-foreground">
                  Currently monitoring: {userCountry ? `${getCountryFlag(userCountry)} ${getCountryName(userCountry)}` : '🌍 Global'}
                </p>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  Change Location
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export function Dashboard() {
  const airQualityData = [
    { city: 'New York', aqi: 45, status: 'Good', color: 'bg-green-500' },
    { city: 'Los Angeles', aqi: 78, status: 'Moderate', color: 'bg-yellow-500' },
    { city: 'Beijing', aqi: 156, status: 'Unhealthy', color: 'bg-red-500' },
    { city: 'London', aqi: 32, status: 'Good', color: 'bg-green-500' }
  ];

  const metrics = [
    { label: 'PM2.5', value: '12.5', unit: 'µg/m³', trend: '+2.1%', color: 'text-green-600' },
    { label: 'PM10', value: '28.7', unit: 'µg/m³', trend: '-1.5%', color: 'text-red-500' },
    { label: 'NO₂', value: '18.3', unit: 'ppb', trend: '+0.8%', color: 'text-yellow-600' },
    { label: 'O₃', value: '45.2', unit: 'ppb', trend: '-3.2%', color: 'text-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Air Quality Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time environmental monitoring</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-green-600 border-green-200">
              🟢 All systems operational
            </Badge>
            <Button size="sm">Export Data</Button>
          </div>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {metrics.map((metric, index) => (
            <Card key={metric.label} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">{metric.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  <span className="text-sm text-gray-500">{metric.unit}</span>
                </div>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${metric.color}`}>
                    {metric.trend}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last hour</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Air Quality Index */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🌍</span>
                  <span>Global Air Quality Index</span>
                </CardTitle>
                <CardDescription>
                  Real-time AQI readings from major cities worldwide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {airQualityData.map((city, index) => (
                  <div key={city.city} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${city.color}`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{city.city}</p>
                        <p className="text-sm text-gray-500">AQI: {city.aqi}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={city.status === 'Good' ? 'default' : city.status === 'Moderate' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {city.status}
                      </Badge>
                      <div className="mt-1 w-24">
                        <Progress value={(city.aqi / 300) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🚨</span>
                  <span>Recent Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-red-50 border border-red-100">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">High PM2.5 Detected</p>
                      <p className="text-xs text-red-600">Beijing • 15 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800">Moderate Air Quality</p>
                      <p className="text-xs text-yellow-600">Los Angeles • 1 hour ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 border border-green-100">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">Air Quality Improved</p>
                      <p className="text-xs text-green-600">London • 2 hours ago</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <Button variant="outline" size="sm" className="w-full">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Monitoring Stations</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">1,247</p>
                </div>
                <div className="text-2xl">📡</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Points Today</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">89,432</p>
                </div>
                <div className="text-2xl">📊</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Global Average AQI</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">67</p>
                </div>
                <div className="text-2xl">🌍</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
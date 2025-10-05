"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Eye, AlertTriangle, Shield, Heart, Users } from 'lucide-react';

interface HealthRecommendationsProps {
  aqi: number;
}

export function HealthRecommendations({ aqi }: HealthRecommendationsProps) {
  const getRecommendations = (aqi: number) => {
    if (aqi <= 50) {
      return {
        level: 'excellent',
        color: 'text-green-400',
        bgColor: 'bg-green-900/20',
        borderColor: 'border-green-700',
        outdoor: "Perfect conditions for all outdoor activities and exercise.",
        sensitive: "Air quality is excellent for all groups including children and elderly.",
        precautions: "No special precautions needed. Enjoy outdoor activities!",
        mask: false,
        exercise: "Ideal time for outdoor exercise and sports.",
        windows: "Perfect time to open windows and ventilate your home."
      };
    } else if (aqi <= 100) {
      return {
        level: 'good',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-900/20',
        borderColor: 'border-yellow-700',
        outdoor: "Good conditions for most outdoor activities.",
        sensitive: "Acceptable for most people. Sensitive individuals should monitor symptoms.",
        precautions: "Consider reducing intense outdoor activities if you're sensitive to air pollution.",
        mask: false,
        exercise: "Good for outdoor exercise, but sensitive people should take breaks.",
        windows: "Good time to ventilate, but sensitive people should be cautious."
      };
    } else if (aqi <= 150) {
      return {
        level: 'moderate',
        color: 'text-orange-400',
        bgColor: 'bg-orange-900/20',
        borderColor: 'border-orange-700',
        outdoor: "Reduce prolonged outdoor activities, especially for sensitive groups.",
        sensitive: "Children, elderly, and people with heart/lung conditions should limit outdoor activities.",
        precautions: "Consider wearing masks outdoors. Limit outdoor exercise.",
        mask: true,
        exercise: "Consider indoor exercise alternatives.",
        windows: "Limit ventilation during peak pollution hours."
      };
    } else {
      return {
        level: 'unhealthy',
        color: 'text-red-400',
        bgColor: 'bg-red-900/20',
        borderColor: 'border-red-700',
        outdoor: "Avoid outdoor activities. Stay indoors as much as possible.",
        sensitive: "High risk for all groups. Seek medical attention if experiencing symptoms.",
        precautions: "Wear N95 masks when going outside. Use air purifiers indoors.",
        mask: true,
        exercise: "Avoid outdoor exercise. Choose indoor activities only.",
        windows: "Keep windows closed. Use air purifiers."
      };
    }
  };

  const recommendations = getRecommendations(aqi);

  const recommendationCards = [
    {
      icon: Eye,
      title: 'Outdoor Activities',
      content: recommendations.outdoor,
      extra: recommendations.exercise
    },
    {
      icon: Users,
      title: 'Sensitive Groups',
      content: recommendations.sensitive,
      extra: "Includes children, elderly, pregnant women, and people with respiratory conditions."
    },
    {
      icon: Shield,
      title: 'Precautions',
      content: recommendations.precautions,
      extra: recommendations.windows
    }
  ];

  return (
    <Card className={`bg-slate-800/60 border-slate-700 shadow-lg border-2 ${recommendations.borderColor} ${recommendations.bgColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold text-slate-100">
          <Leaf className={`h-7 w-7 mr-3 ${recommendations.color}`} />
          Health Recommendations
          <Badge className={`ml-auto bg-slate-700/50 ${recommendations.color} border-current`}>
            AQI {aqi} - {recommendations.level.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {recommendationCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div key={index} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${recommendations.bgColor} border ${recommendations.borderColor}`}>
                    <IconComponent className={`h-6 w-6 ${recommendations.color}`} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-100">{card.title}</h4>
                </div>
                <div className="space-y-3">
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {card.content}
                  </p>
                  <p className="text-sm text-slate-400 italic">
                    {card.extra}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Mask Recommendation */}
        {recommendations.mask && (
          <div className="mt-6 p-4 bg-red-900/30 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <span className="font-bold text-red-300">Mask Recommendation:</span>
            </div>
            <p className="mt-1 text-red-200">
              Wear N95 or equivalent masks when outdoors. Consider using air purifiers indoors.
            </p>
          </div>
        )}
        
        {/* Health Alert for Very High AQI */}
        {aqi > 200 && (
          <div className="mt-4 p-4 bg-purple-900/30 border-l-4 border-purple-500 rounded-r-lg">
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-purple-400 mr-2" />
              <span className="font-bold text-purple-300">Health Alert:</span>
            </div>
            <p className="mt-1 text-purple-200">
              Seek medical attention if you experience difficulty breathing, chest pain, or persistent cough.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

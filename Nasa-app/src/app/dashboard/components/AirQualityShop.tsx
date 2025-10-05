"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ExternalLink, Filter, Search, Star } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  category: string;
  title: string;
  description: string;
  use_case: string;
  image_url: string;
  buy_url: string;
}

interface AirQualityShopProps {
  currentAQI?: number;
}

const shopData: Product[] = [
  {
    "id": "purifier-01",
    "category": "Air Purifier",
    "title": "Coway AP-1512HH Mighty Air Purifier",
    "description": "HEPA air purifier with true HEPA filter, suitable for rooms up to ~361 ft².",
    "use_case": "Great for AQI > 80; helps reduce PM2.5 & allergens indoors.",
    "image_url": "https://m.media-amazon.com/images/I/61SCshujZlL._AC_SY450_.jpg",
    "buy_url": "https://a.co/d/7Sw9DYI"
  },
  {
    "id": "purifier-02",
    "category": "Air Purifier",
    "title": "Levoit Core 300 Smart True HEPA Air Purifier",
    "description": "Compact purifier with smart app control, ideal for bedrooms/offices up to 219 ft².",
    "use_case": "Use when AQI > 100 or during smoke/particulate events.",
    "image_url": "https://m.media-amazon.com/images/I/71t-9BTIg9L._AC_SY879_.jpg",
    "buy_url": "https://a.co/d/dBWuwSP"
  },
  {
    "id": "mask-01",
    "category": "Mask",
    "title": "3M Aura 9205+ N95 Respirator",
    "description": "N95 respirator with comfortable design and exhalation valve, filters airborne particles.",
    "use_case": "Recommended when AQI is 'Unhealthy' (AQI >150) or during high particulate events.",
    "image_url": "https://m.media-amazon.com/images/I/81Cy+RHp6CL._AC_SY300_SX300_QL70_FMwebp_.jpg",
    "buy_url": "https://a.co/d/hIQrGRj"
  },
  {
    "id": "mask-02",
    "category": "Mask",
    "title": "Honeywell NIOSH N95 Disposable Respirator",
    "description": "Lightweight N95 respirator for everyday protection.",
    "use_case": "Good for moderate to unhealthy air quality (AQI 100–200).",
    "image_url": "https://m.media-amazon.com/images/I/71BN6DqThdL._AC_SX450_PIbundle-20,TopRight,0,0_SH20_.jpg",
    "buy_url": "https://a.co/d/fxWgrsY"
  },
  {
    "id": "monitor-01",
    "category": "Monitor",
    "title": "PurpleAir PA-II Outdoor Air Quality Sensor",
    "description": "Personal outdoor air quality monitor measuring PM2.5, provides local data.",
    "use_case": "Useful for monitoring local pollutant levels when AQI data is coarse.",
    "image_url": "https://www2.purpleair.com/cdn/shop/files/IMG_2535-2_1024x1024@2x.jpg?v=1731539126",
    "buy_url": "https://www2.purpleair.com/products/purpleair-flex"
  },
  {
    "id": "monitor-02",
    "category": "Monitor",
    "title": "Temtop M10 Air Quality Monitor",
    "description": "Portable air quality monitor (PM2.5, TVOC, CO₂) for indoor use.",
    "use_case": "Helpful if you want to track indoor air especially during poor outdoor air days.",
    "image_url": "https://m.media-amazon.com/images/I/415wcagwhmL._SX342_.jpg",
    "buy_url": "https://a.co/d/6zMhjyL"
  }
];

const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'Air Purifier':
      return '💨';
    case 'Mask':
      return '😷';
    case 'Monitor':
      return '📊';
    default:
      return '🛒';
  }
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Air Purifier':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Mask':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Monitor':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getRecommendationLevel = (product: Product, currentAQI: number): 'high' | 'medium' | 'low' => {
  const useCase = product.use_case.toLowerCase();
  
  if (useCase.includes('aqi > 150') || useCase.includes('aqi >150')) {
    return currentAQI > 150 ? 'high' : 'low';
  }
  if (useCase.includes('aqi > 100') || useCase.includes('aqi >100')) {
    return currentAQI > 100 ? 'high' : currentAQI > 80 ? 'medium' : 'low';
  }
  if (useCase.includes('aqi > 80') || useCase.includes('aqi >80')) {
    return currentAQI > 80 ? 'high' : currentAQI > 50 ? 'medium' : 'low';
  }
  
  return 'medium';
};

const getRecommendationBadge = (level: 'high' | 'medium' | 'low'): { text: string; className: string } => {
  switch (level) {
    case 'high':
      return { text: 'Highly Recommended', className: 'bg-red-500/20 text-red-400 border-red-500/30' };
    case 'medium':
      return { text: 'Recommended', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    case 'low':
      return { text: 'Optional', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  }
};

export function AirQualityShop({ currentAQI = 50 }: AirQualityShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', ...Array.from(new Set(shopData.map(product => product.category)))];

  const filteredProducts = shopData.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products by recommendation level
  const sortedProducts = filteredProducts.sort((a, b) => {
    const levelA = getRecommendationLevel(a, currentAQI);
    const levelB = getRecommendationLevel(b, currentAQI);
    
    const levelOrder = { 'high': 0, 'medium': 1, 'low': 2 };
    return levelOrder[levelA] - levelOrder[levelB];
  });

  return (
      <Card className="bg-transparent border-0 shadow-none rounded-3xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Air Quality Solutions</h3>
              <p className="text-sm text-slate-400">Products to improve your air quality (Current AQI: {currentAQI})</p>
            </div>
          </div>
          <Badge variant="outline" className="text-slate-300 border-slate-500 bg-slate-700/30">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            {filteredProducts.length} Products
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700/80'
                }`}
              >
                {category !== 'All' && (
                  <span className="mr-1">{getCategoryIcon(category)}</span>
                )}
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => {
            const recommendationLevel = getRecommendationLevel(product, currentAQI);
            const recommendationBadge = getRecommendationBadge(recommendationLevel);

            return (
              <div
                key={product.id}
                className="group relative bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 border border-slate-700/50 hover:border-slate-600/50"
              >
                <div className="relative">
                  {/* Recommendation Badge */}
                  <div className="absolute top-3 right-3 z-10">
                  <Badge className={`text-xs px-2 py-1 ${recommendationBadge.className} border`}>
                    {recommendationBadge.text}
                  </Badge>
                </div>

                {/* Product Image */}
                <div className="relative h-48 bg-slate-700/30 overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="p-4 space-y-3">
                  {/* Category */}
                  <Badge className={`text-xs px-2 py-1 ${getCategoryColor(product.category)} border`}>
                    <span className="mr-1">{getCategoryIcon(product.category)}</span>
                    {product.category}
                  </Badge>

                  {/* Title */}
                  <h4 className="font-bold text-slate-100 text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {product.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Use Case */}
                  <div className="bg-slate-700/40 rounded-lg p-3 border border-slate-600/50">
                    <p className="text-xs text-slate-300">
                      <strong className="text-blue-400">Best for:</strong> {product.use_case}
                    </p>
                  </div>

                  {/* Rating (Mock) */}
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-3 w-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-xs text-slate-400 ml-2">(4.5/5)</span>
                  </div>

                  {/* Buy Button */}
                  <Button
                    onClick={() => window.open(product.buy_url, '_blank')}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                </div>

                  {/* Hover Effect Glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* AQI-based Recommendations */}
        <div className="mt-8 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
          <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
            Recommendations for Current AQI ({currentAQI})
          </h4>
          <div className="text-xs text-slate-400 space-y-1">
            {currentAQI <= 50 && (
              <p>✅ Air quality is good. Monitors can help track changes.</p>
            )}
            {currentAQI > 50 && currentAQI <= 100 && (
              <p>⚠️ Moderate air quality. Consider air purifiers for sensitive individuals.</p>
            )}
            {currentAQI > 100 && currentAQI <= 150 && (
              <p>🟠 Unhealthy for sensitive groups. Air purifiers and masks recommended.</p>
            )}
            {currentAQI > 150 && (
              <p>🔴 Unhealthy air quality. Use air purifiers indoors and wear masks outdoors.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

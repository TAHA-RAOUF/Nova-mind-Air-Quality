"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import L from 'leaflet';

interface AQILocation {
  lat: number;
  lng: number;
  aqi: number;
  city?: string;
  country?: string;
}

interface AQIGlobeProps {
  aqiLocations: AQILocation[];
}

// Declare Google Maps types for TypeScript
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function AQIGlobe({ aqiLocations }: AQIGlobeProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<AQILocation | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Initialize OpenStreetMap with Leaflet (no API key required)
    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Clear any existing map container
      mapRef.current.innerHTML = '';
      (mapRef.current as any)._leaflet_id = null;

      // Initialize the map
      const map = L.map(mapRef.current, {
        center: [51.505, -0.09],
        zoom: 3,
        zoomControl: true,
        attributionControl: false
      });

      mapInstanceRef.current = map;

      // Add dark theme base layer (OpenStreetMap)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Add WAQI air quality overlay with your token
      const aqiLayer = L.tileLayer('https://tiles.aqicn.org/tiles/usepa-aqi/{z}/{x}/{y}.png?token=01c08d979fa0af6bf385a90b109d96a1f01ff102', {
        opacity: 0.7,
        attribution: 'Air Quality data © WAQI'
      });
      aqiLayer.addTo(map);

      // Add markers for AQI locations
      aqiLocations.forEach((location) => {
        const marker = L.circleMarker([location.lat, location.lng], {
          radius: 8,
          fillColor: getAQIColor(location.aqi),
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map);

        // Add popup
        marker.bindPopup(`
          <div style="color: #000; font-family: Arial, sans-serif;">
            <strong>${location.city}, ${location.country}</strong><br/>
            <span style="font-size: 16px; font-weight: bold;">AQI: ${location.aqi}</span><br/>
            <span style="color: #666;">${getAQIDescription(location.aqi)}</span>
          </div>
        `);

        // Add click listener
        marker.on('click', () => {
          setSelectedLocation(location);
        });
      });

      setMapLoaded(true);
    };

    // Load Leaflet CSS
    const loadLeafletCSS = () => {
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
    };

    loadLeafletCSS();
    setTimeout(initializeMap, 100); // Small delay to ensure CSS is loaded

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [aqiLocations]);

  const getAQIDescription = (aqi: number) => {
    if (aqi <= 50) return "Good air quality ✅";
    if (aqi <= 100) return "Moderate 🌤️";
    if (aqi <= 150) return "Unhealthy for sensitive groups ⚠️";
    return "Hazardous 🚨";
  };

  // Map AQI to color
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#22c55e"; // green
    if (aqi <= 100) return "#eab308"; // yellow
    if (aqi <= 150) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl p-6 min-h-[400px] border border-slate-700/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-lg">
            <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Global Air Quality Map</h3>
            <p className="text-sm text-slate-400">Real-time air quality monitoring worldwide</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-slate-300">Live Data</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-80 rounded-xl overflow-hidden border border-slate-700/30 bg-slate-900/50">
        <div 
          ref={mapRef}
          className="w-full h-full"
        />
        
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent mx-auto"></div>
              <p className="text-slate-300 text-sm">Loading Air Quality Map...</p>
            </div>
          </div>
        )}

        {/* AQI Legend */}
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 text-white border border-slate-700/50">
          <h4 className="font-semibold mb-2 text-xs text-blue-300">AQI Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Good (0-50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Moderate (51-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Unhealthy (101-150)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Hazardous (151+)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Popup when clicking a point */}
      {selectedLocation && (
        <div className="absolute bottom-6 left-6 bg-slate-900/95 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 w-64 shadow-lg z-10">
          <h4 className="font-semibold text-blue-300">
            {selectedLocation.city}, {selectedLocation.country}
          </h4>
          <p className="text-lg font-bold text-white">AQI {selectedLocation.aqi}</p>
          <p className="text-sm text-gray-300 mt-1">
            {selectedLocation.aqi <= 50 && "Good air quality ✅"}
            {selectedLocation.aqi > 50 && selectedLocation.aqi <= 100 && "Moderate 🌤️"}
            {selectedLocation.aqi > 100 && selectedLocation.aqi <= 150 && "Unhealthy for sensitive groups ⚠️"}
            {selectedLocation.aqi > 150 && "Hazardous 🚨"}
          </p>
          <button
            className="mt-3 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
            onClick={() => setSelectedLocation(null)}
          >
            Close
          </button>
        </div>
      )}
    </motion.div>
  );
}

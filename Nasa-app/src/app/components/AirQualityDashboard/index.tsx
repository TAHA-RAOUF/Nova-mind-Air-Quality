"use client";

import Header from '../Header';
import AirQualityStats from '../AirQualityStats';
import AQIGlobe from '../AQIGlobe';
import { WorldMap } from '../map';
import AnimatedBackground from '../AnimatedBackground';
 import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { motion } from "framer-motion";

export default function AirQualityDashboard() {
  const aqiLocations = [
    { lat: -6.2088, lng: 106.8456, aqi: 137, city: "Jakarta", country: "Indonesia" },
    { lat: 28.7041, lng: 77.1025, aqi: 174, city: "Delhi", country: "India" },
    { lat: 40.7128, lng: -74.0060, aqi: 90, city: "New York", country: "USA" },
    { lat: 51.5074, lng: -0.1278, aqi: 78, city: "London", country: "UK" },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 to-blue-950 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground className="fixed inset-0" />
      
      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col">
        <Header />
      
        <div className="flex-1 container mx-auto px-4 pt-20 pb-4">
          {/* Compact Header Section */}
          <div className="mb-6 text-center">
            <motion.div className="relative flex flex-col items-center justify-center gap-2 text-center">
              <LayoutTextFlip
                text="Welcome to "
                words={["Aerexus","Air Quality"]}
              />
            </motion.div>
            <p className="mt-3 text-center text-sm text-neutral-300 dark:text-neutral-400 max-w-2xl mx-auto">
              Experience real-time air quality monitoring with cutting-edge technology.
            </p>
          </div>

          {/* Main Content Grid - Compact Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
            {/* Statistics Sidebar */}
            <div className="xl:col-span-1 h-full">
              <div className="h-full flex flex-col">
                <AirQualityStats />
              </div>
            </div>

            {/* Globe Section */}
            <div className="xl:col-span-3 h-full">
              <AQIGlobe aqiLocations={aqiLocations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

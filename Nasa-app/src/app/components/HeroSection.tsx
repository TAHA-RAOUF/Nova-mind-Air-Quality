"use client";
import React from "react";
import { SparklesCore } from "../../components/ui/sparkles";

export default function HeroSection() {
  return (
    <div className="h-32 w-full bg-transparent flex flex-col items-center justify-center overflow-hidden relative">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-white relative z-20 mb-4">
        Aerexus
      </h1>
      <div className="w-80 h-20 relative">
        {/* Gradients */}
        <div className="absolute inset-x-10 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[1px] w-3/4 blur-sm" />
        <div className="absolute inset-x-10 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[2px] w-1/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.3}
          maxSize={0.8}
          particleDensity={800}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 to-blue-950 [mask-image:radial-gradient(200px_100px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}

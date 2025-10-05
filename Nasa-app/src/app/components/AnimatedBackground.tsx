"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "../../components/ui/spotlight";

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className = "" }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-black/[0.96] antialiased", className)}>
      {/* Grid background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none opacity-20",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
        )}
      />

      {/* Multiple spotlights for better coverage */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="#3b82f6"
      />
      <Spotlight
        className="top-10 right-0 md:top-20 md:right-60"
        fill="#8b5cf6"
      />
      <Spotlight
        className="bottom-10 left-1/2 md:bottom-20 md:left-1/3"
        fill="#06b6d4"
      />
    </div>
  );
};

export default AnimatedBackground;

"use client";
import React, { useId, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SparklesProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
}

export const SparklesCore = (props: SparklesProps) => {
  const {
    id,
    className,
    background = "#0F172A",
    minSize = 0.6,
    maxSize = 1.4,
    particleDensity = 100,
    particleColor = "#FFF",
  } = props;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generateId = useId();
  const uniqueId = id || generateId;

  if (!isClient) {
    return <div className={cn("opacity-0", className)} />;
  }

  return (
    <div className={cn("relative", className)}>
      <svg
        className="animate-pulse w-full h-full absolute inset-0"
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`sparkles-${uniqueId}`}
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            {Array.from({ length: Math.floor(particleDensity / 10) }).map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 100}
                cy={Math.random() * 100}
                r={Math.random() * (maxSize - minSize) + minSize}
                fill={particleColor}
                opacity={Math.random() * 0.8 + 0.2}
              >
                <animate
                  attributeName="opacity"
                  values="0.2;1;0.2"
                  dur={`${Math.random() * 3 + 1}s`}
                  repeatCount="indefinite"
                />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values={`0 0; ${Math.random() * 20 - 10} ${Math.random() * 20 - 10}; 0 0`}
                  dur={`${Math.random() * 4 + 2}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#sparkles-${uniqueId})`} />
        
        {/* Additional floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <circle
            key={`particle-${i}`}
            cx={Math.random() * 400}
            cy={Math.random() * 400}
            r={Math.random() * maxSize + minSize}
            fill={particleColor}
            opacity={0.6}
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur={`${Math.random() * 2 + 1}s`}
              repeatCount="indefinite"
              begin={`${Math.random() * 2}s`}
            />
            <animate
              attributeName="cy"
              values={`${Math.random() * 400}; ${Math.random() * 400}; ${Math.random() * 400}`}
              dur={`${Math.random() * 10 + 5}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
};

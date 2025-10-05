"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface BackgroundGradientProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: BackgroundGradientProps) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };

  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500",
          animate && "animate-gradient-xy",
          "bg-gradient-to-r from-blue-500 via-teal-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600"
        )}
      />
      <div
        className={cn(
          "relative bg-white border border-transparent rounded-3xl z-10 dark:bg-zinc-900",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

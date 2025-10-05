"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "div",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const radialGradientSize = 100;
  const radialGradientSpread = 80;

  return (
    <Tag
      onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-shrink-0 overflow-visible",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn("w-auto text-white z-10 bg-black px-4 py-2 rounded-[inherit]", className)}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-shrink-0 rounded-[inherit] bg-[radial-gradient(var(--radial-gradient-size)_circle_at_var(--x)_var(--y),var(--radial-gradient-inner),transparent_var(--radial-gradient-spread))]"
        )}
        style={{
          "--radial-gradient-size": radialGradientSize + "px",
          "--radial-gradient-inner": "#3b82f6,#10b981,#8b5cf6",
          "--radial-gradient-spread": radialGradientSpread + "%",
        } as React.CSSProperties}
        initial={{ "--x": "0px", "--y": "0px" } as any}
        animate={
          hovered
            ? {
                "--x": "100px",
                "--y": "100px",
              }
            : {
                "--x": "0px",
                "--y": "0px",
              }
        }
        transition={{
          duration: duration,
          ease: "easeInOut",
        }}
      />
    </Tag>
  );
}

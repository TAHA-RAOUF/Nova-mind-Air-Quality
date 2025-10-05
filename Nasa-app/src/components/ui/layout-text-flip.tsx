"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LayoutTextFlipProps {
  text: string;
  words: string[];
  duration?: number;
  className?: string;
}

export const LayoutTextFlip = ({
  text,
  words,
  duration = 3000,
  className,
}: LayoutTextFlipProps) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = words.indexOf(currentWord);
      const nextIndex = (currentIndex + 1) % words.length;
      setCurrentWord(words[nextIndex]);
      setIsAnimating(true);
    }, duration);

    return () => clearInterval(interval);
  }, [currentWord, words, duration]);

  return (
    <div
      className={cn(
        "inline-flex items-center text-4xl font-bold text-white md:text-6xl lg:text-7xl",
        className
      )}
    >
      <span className="mr-2">{text}</span>
      <div className="relative inline-block">
        <AnimatePresence
          mode="wait"
          onExitComplete={() => {
            setIsAnimating(false);
          }}
        >
          <motion.span
            key={currentWord}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="inline-block bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent"
          >
            {currentWord}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';

interface SplashScreenProps {
  isVisible: boolean;
}

const fullText = "Silzey POS";
const typingSpeed = 120; // milliseconds per character

const SplashScreen: FC<SplashScreenProps> = ({ isVisible }) => {
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    // Reset animation when visibility changes to true
    if (isVisible) {
      setDisplayText('');
      setCharIndex(0);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && charIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timer); // Cleanup timer on unmount or if dependencies change
    }
  }, [isVisible, charIndex]); // Rerun effect if isVisible or charIndex changes

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary text-primary-foreground animate-fade-in"
      aria-hidden={!isVisible}
      role="status"
    >
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-cursive">
        {displayText}
        {charIndex < fullText.length && ( // Show cursor only while typing
          <span className="animate-pulse ml-1">|</span>
        )}
      </h1>
    </div>
  );
};

export default SplashScreen;

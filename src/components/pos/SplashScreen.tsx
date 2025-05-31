"use client";

import type { FC } from 'react';

interface SplashScreenProps {
  isVisible: boolean;
}

const SplashScreen: FC<SplashScreenProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900 text-white animate-fade-in"
      aria-hidden={!isVisible}
      role="status"
    >
      <h1 className="text-5xl font-bold font-headline">Silzey POS</h1>
    </div>
  );
};

export default SplashScreen;

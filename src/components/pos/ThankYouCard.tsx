"use client";

import type { FC } from 'react';
import { CheckCircle } from 'lucide-react';

interface ThankYouCardProps {
  isVisible: boolean;
}

const ThankYouCard: FC<ThankYouCardProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-background p-8 sm:p-10 rounded-xl shadow-2xl text-center max-w-md w-full mx-4 animate-modal-fade-in">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold font-headline text-primary mb-3">Thank You!</h2>
        <p className="text-lg text-foreground/80 mb-2">
          Your order is being processed.
        </p>
        <p className="text-sm text-muted-foreground">
          This screen will reset shortly.
        </p>
      </div>
    </div>
  );
};

export default ThankYouCard;

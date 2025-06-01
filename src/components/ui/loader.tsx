
"use client";

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FullPageLoaderProps {
  className?: string;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className
      )}
      aria-label="Loading dashboard content"
      role="progressbar"
    >
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
};

export default FullPageLoader;

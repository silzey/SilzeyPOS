
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function AppProviders({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        {isMounted && <Toaster />}
      </AuthProvider>
    </ThemeProvider>
  );
}


"use client";

import type { ReactNode } from 'react';
// Intentionally commenting out other imports for this test
// import { useState, useEffect } from 'react';
// import { Toaster } from "@/components/ui/toaster";
// import { AuthProvider } from '@/contexts/AuthContext';
// import { ThemeProvider } from '@/contexts/ThemeContext';

export default function AppProviders({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // Temporarily rendering only children to isolate the error
  return <>{children}</>;

  /*
  // Original content:
  // return (
  //   <ThemeProvider>
  //     <AuthProvider>
  //       {children}
  //       {isMounted && <Toaster />}
  //     </AuthProvider>
  //   </ThemeProvider>
  // );
  */
}

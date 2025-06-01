
import type { Metadata } from 'next';
import './globals.css';
// import { Toaster } from "@/components/ui/toaster"; // Toaster temporarily removed
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext'; // Import ThemeProvider

export const metadata: Metadata = {
  title: 'Silzey POS',
  description: 'Cannabis Dispensary Point of Sale System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Add suppressHydrationWarning if class is applied on server */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider> {/* Wrap AuthProvider and children with ThemeProvider */}
          <AuthProvider>
            {children}
            {/* <Toaster /> */} {/* Toaster temporarily removed */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

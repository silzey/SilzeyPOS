
"use client";

import type { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, LogIn, LogOut, UserPlus, LayoutDashboard, Sun, Moon } from 'lucide-react'; // Added Sun, Moon
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext'; // Import useTheme

interface HeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
}

const Header: FC<HeaderProps> = ({ cartItemCount, onOpenCart }) => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Use theme context
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure theme-dependent UI only renders on client
  }, []);


  return (
    <header className="sticky top-0 z-40 bg-background py-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center gap-2 sm:gap-4">
        <Link href="/" passHref>
          <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary cursor-pointer flex-shrink-0">
            Silzey POS
          </h1>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
          {isClient && ( // Only render theme toggle on client
            <Button
                onClick={toggleTheme}
                variant="outline"
                size="icon"
                className="rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 group"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
                {theme === 'light' ? (
                <Moon className="h-5 w-5 group-hover:text-primary transition-colors" />
                ) : (
                <Sun className="h-5 w-5 group-hover:text-primary transition-colors" />
                )}
            </Button>
          )}
          {authLoading ? (
            <Button variant="outline" size="icon" className="rounded-full" disabled>
              <User className="h-5 w-5" />
            </Button>
          ) : user ? (
            <>
              <Link href="/profile" passHref>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 group"
                  aria-label="View user profile"
                >
                  <User className="h-5 w-5 group-hover:text-primary transition-colors" />
                </Button>
              </Link>
              <Link href="/dashboard" passHref>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 group"
                  aria-label="Open Dashboard"
                >
                  <LayoutDashboard className="h-5 w-5 group-hover:text-primary transition-colors" />
                </Button>
              </Link>
              <Button
                onClick={signOut}
                variant="outline"
                className="rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 group px-3 text-xs sm:text-sm"
                aria-label="Sign out"
              >
                <LogOut className="h-4 sm:h-5 w-4 sm:w-5 mr-0 sm:mr-2 group-hover:text-destructive transition-colors" />
                <span className="hidden sm:inline font-semibold">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" passHref>
                <Button variant="outline" className="rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 group px-3 sm:px-4">
                  <LogIn className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 group-hover:text-primary transition-colors" />
                  <span className="font-semibold text-xs sm:text-sm">Sign In</span>
                </Button>
              </Link>
              <Link href="/auth/signup" passHref>
                <Button variant="default" className="rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 group px-3 sm:px-4">
                  <UserPlus className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 group-hover:text-white transition-colors" />
                  <span className="font-semibold text-xs sm:text-sm">Sign Up</span>
                </Button>
              </Link>
            </>
          )}
          <Button
            onClick={onOpenCart}
            variant="outline"
            className="rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 group px-3 sm:px-4"
            aria-label={`Open cart with ${cartItemCount} items`}
          >
            <ShoppingBag className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 group-hover:text-primary transition-colors" />
            <span className="font-semibold text-xs sm:text-sm">Cart</span>
            {cartItemCount > 0 && (
              <span className="ml-1.5 sm:ml-2 bg-primary text-primary-foreground text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
                {cartItemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

// Need to import useState and useEffect for the client-side rendering gate
import { useState, useEffect } from 'react';
export default Header;

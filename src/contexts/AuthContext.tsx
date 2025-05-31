
"use client";

import type { UserProfile } from '@/types/pos';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for successful login/signup
const mockUser: UserProfile = {
  id: 'user-123',
  firstName: 'Kim',
  lastName: 'Lunaris',
  email: 'kim.l@silzeypos.com',
  avatarUrl: 'https://placehold.co/150x150.png',
  bio: 'Enthusiastic budtender with a passion for quality cannabis products and customer education. Helping people find the perfect strain since 2020.',
  memberSince: 'January 15, 2023',
  rewardsPoints: 1250,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // Start true to check initial state
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for an existing session (e.g., from localStorage)
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    console.log("Attempting mock sign in with:", email); // Keep console logs for mock
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    if (email === "kim.l@silzeypos.com" && pass === "password123") {
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      router.push('/'); 
    } else {
      // In a real app, you'd handle errors properly
      alert("Mock Sign In Failed: Use kim.l@silzeypos.com / password123");
    }
    setLoading(false);
  };

  const signUp = async (email: string, pass: string, firstName: string, lastName: string) => {
    setLoading(true);
    console.log("Attempting mock sign up for:", email);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    const newUser: UserProfile = {
      ...mockUser, // Use some mock data
      id: `user-${Date.now()}`,
      email,
      firstName,
      lastName,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
    setUser(newUser);
    localStorage.setItem('mockUser', JSON.stringify(newUser));
    router.push('/');
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem('mockUser');
    router.push('/auth/signin');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


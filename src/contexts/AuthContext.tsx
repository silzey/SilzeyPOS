
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

const MOCK_USER_STORAGE_KEY = 'mockUserSilzey';
const NEWLY_REGISTERED_USERS_STORAGE_KEY = 'newlyRegisteredUsersSilzey';

// Base mock user data for successful login/signup structure
const baseMockUser: Omit<UserProfile, 'id' | 'email' | 'firstName' | 'lastName' | 'memberSince' | 'rewardsPoints'> = {
  avatarUrl: 'https://placehold.co/150x150.png',
  dataAiHint: 'user avatar',
  bio: 'Enthusiastic user, recently joined!',
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem(MOCK_USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem(MOCK_USER_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Check against the specific mock user for login
    if (email === "kim.l@silzeypos.com" && pass === "password123") {
      const kimUser: UserProfile = {
        id: 'user-kim-123',
        firstName: 'Kim',
        lastName: 'Lunaris',
        email: 'kim.l@silzeypos.com',
        avatarUrl: 'https://placehold.co/150x150.png?text=KL',
        dataAiHint: 'person face',
        bio: 'Enthusiastic budtender with a passion for quality cannabis products and customer education. Helping people find the perfect strain since 2020.',
        memberSince: 'January 15, 2023',
        rewardsPoints: 1250,
      };
      setUser(kimUser);
      localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(kimUser));
      router.push('/');
    } else {
      // Try to find user in newly registered list for login
      const newlyRegisteredUsersRaw = localStorage.getItem(NEWLY_REGISTERED_USERS_STORAGE_KEY);
      const newlyRegisteredUsers: UserProfile[] = newlyRegisteredUsersRaw ? JSON.parse(newlyRegisteredUsersRaw) : [];
      const foundNewUser = newlyRegisteredUsers.find(u => u.email === email); // In a real app, password would be hashed and checked

      if (foundNewUser) {
         // For mock, we assume password matches if email is found
        setUser(foundNewUser);
        localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(foundNewUser));
        router.push('/');
      } else {
        alert("Mock Sign In Failed: Use kim.l@silzeypos.com / password123 or a newly registered account.");
      }
    }
    setLoading(false);
  };

  const signUp = async (email: string, pass: string, firstName: string, lastName: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: UserProfile = {
      ...baseMockUser,
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email,
      firstName,
      lastName,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      rewardsPoints: 0, // New users start with 0 points
    };

    // Add to list of newly registered users
    const newlyRegisteredUsersRaw = localStorage.getItem(NEWLY_REGISTERED_USERS_STORAGE_KEY);
    let newlyRegisteredUsers: UserProfile[] = newlyRegisteredUsersRaw ? JSON.parse(newlyRegisteredUsersRaw) : [];
    
    // Check if user already exists in this list
    if (newlyRegisteredUsers.some(u => u.email === email)) {
      alert("An account with this email already exists in the newly registered list.");
      setLoading(false);
      return;
    }
    
    newlyRegisteredUsers.push(newUser);
    localStorage.setItem(NEWLY_REGISTERED_USERS_STORAGE_KEY, JSON.stringify(newlyRegisteredUsers));

    // Set current user for session
    setUser(newUser);
    localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(newUser));
    router.push('/');
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem(MOCK_USER_STORAGE_KEY);
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

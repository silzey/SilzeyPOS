
"use client";

import type { UserProfile } from '@/types/pos';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACTIVE_USER_STORAGE_KEY = 'activeUserSilzeyPOS';
const ALL_USERS_STORAGE_KEY = 'allUserProfilesSilzeyPOS'; // Stores all known user profiles

// Helper to parse display name
constparseName = (displayName: string | null): { firstName: string; lastName: string } => {
  if (!displayName) return { firstName: 'User', lastName: '' };
  const parts = displayName.split(' ');
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      if (firebaseUser) {
        const allUsersRaw = localStorage.getItem(ALL_USERS_STORAGE_KEY);
        let allUsers: UserProfile[] = allUsersRaw ? JSON.parse(allUsersRaw) : [];
        
        let userProfile = allUsers.find(u => u.id === firebaseUser.uid || u.email === firebaseUser.email);

        if (!userProfile) {
          // New user or existing user not yet in our local store with UID
          const { firstName, lastName } = constparseName(firebaseUser.displayName);
          userProfile = {
            id: firebaseUser.uid,
            firstName,
            lastName,
            email: firebaseUser.email || 'no-email@example.com',
            avatarUrl: firebaseUser.photoURL || `https://placehold.co/150x150.png?text=${firstName.charAt(0)}${lastName.charAt(0) || ''}`,
            dataAiHint: 'user avatar',
            bio: 'Welcome to Silzey POS!',
            memberSince: new Date().toISOString(),
            rewardsPoints: 0,
          };
          // Add or update user in allUsers list
          const existingUserIndex = allUsers.findIndex(u => u.email === userProfile!.email);
          if (existingUserIndex > -1) {
            allUsers[existingUserIndex] = { ...allUsers[existingUserIndex], ...userProfile }; // Merge if email matched but ID didn't (e.g. old record)
          } else {
            allUsers.push(userProfile);
          }
          localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(allUsers));
        }
        
        setUser(userProfile);
        localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(userProfile));
        // Only redirect if they are on an auth page
        if (router.pathname?.startsWith('/auth')) {
          router.push('/');
        }

      } else {
        setUser(null);
        localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
      }
      setLoading(false);
    });

    // Attempt to load from active user storage on initial mount for faster UI update
    // while onAuthStateChanged initializes
    const storedActiveUser = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    if (storedActiveUser && !auth.currentUser) {
        try {
            setUser(JSON.parse(storedActiveUser));
        } catch (e) {
            localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
        }
    }


    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle setting the user and redirecting
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      alert("Google Sign-In Failed. Please try again.");
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    await firebaseSignOut(auth);
    setUser(null);
    localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
    router.push('/auth/signin');
    setLoading(false);
  };

  // Remove signIn and signUp as they are replaced by signInWithGoogle
  const contextValue: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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

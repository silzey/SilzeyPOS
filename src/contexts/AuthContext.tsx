
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
  signInWithEmail: (email: string, pass: string) => Promise<boolean>; // Added for email/password
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACTIVE_USER_STORAGE_KEY = 'activeUserSilzeyPOS';
const ALL_USERS_STORAGE_KEY = 'allUserProfilesSilzeyPOS';

const parseName = (displayName: string | null): { firstName: string; lastName: string } => {
  if (!displayName) return { firstName: 'User', lastName: '' };
  const parts = displayName.split(' ');
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
};

// Mock user for email/password sign-in
const MOCK_EMAIL_USER: UserProfile = {
  id: 'mock-email-user-123',
  firstName: 'Mock',
  lastName: 'User',
  email: 'test@example.com',
  avatarUrl: 'https://placehold.co/150x150.png?text=MU',
  dataAiHint: 'user avatar',
  bio: 'A mock user for email/password testing.',
  memberSince: new Date(2023, 0, 1).toISOString(),
  rewardsPoints: 100,
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
          const { firstName, lastName } = parseName(firebaseUser.displayName);
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
          const existingUserIndex = allUsers.findIndex(u => u.email === userProfile!.email);
          if (existingUserIndex > -1) {
            allUsers[existingUserIndex] = { ...allUsers[existingUserIndex], ...userProfile };
          } else {
            allUsers.push(userProfile);
          }
          localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(allUsers));
        }
        
        setUser(userProfile);
        localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(userProfile));
        if (router.pathname?.startsWith('/auth')) {
          router.push('/');
        }

      } else {
        // Only clear user if not handling mock login
        const activeUser = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
        if (activeUser) {
            try {
                const parsedActiveUser = JSON.parse(activeUser);
                if (parsedActiveUser.id !== MOCK_EMAIL_USER.id) { // Don't clear if it's the mock user
                    setUser(null);
                    localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
                }
            } catch (e) {
                setUser(null);
                localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
            }
        } else {
            setUser(null);
        }
      }
      setLoading(false);
    });

    const storedActiveUser = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    if (storedActiveUser && !auth.currentUser) { // Check !auth.currentUser here
        try {
            const parsedUser = JSON.parse(storedActiveUser);
            setUser(parsedUser);
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
      // onAuthStateChanged will handle the rest
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      alert("Google Sign-In Failed. Please try again.");
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    // This is a MOCK sign-in.
    if (email === MOCK_EMAIL_USER.email && pass === "superSecure123") { // Changed password here
      setUser(MOCK_EMAIL_USER);
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(MOCK_EMAIL_USER));
      
      // Add/update mock user in all users list if not present or different
      const allUsersRaw = localStorage.getItem(ALL_USERS_STORAGE_KEY);
      let allUsers: UserProfile[] = allUsersRaw ? JSON.parse(allUsersRaw) : [];
      const existingMockUserIndex = allUsers.findIndex(u => u.id === MOCK_EMAIL_USER.id || u.email === MOCK_EMAIL_USER.email);
      if (existingMockUserIndex > -1) {
        allUsers[existingMockUserIndex] = { ...allUsers[existingMockUserIndex], ...MOCK_EMAIL_USER};
      } else {
        allUsers.push(MOCK_EMAIL_USER);
      }
      localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(allUsers));

      setLoading(false);
      if (router.pathname?.startsWith('/auth')) {
        router.push('/');
      }
      return true;
    }
    setLoading(false);
    return false;
  };

  const signOut = async () => {
    setLoading(true);
    const activeUserRaw = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    let isMockUser = false;
    if (activeUserRaw) {
        try {
            const activeUser = JSON.parse(activeUserRaw);
            if (activeUser.id === MOCK_EMAIL_USER.id) {
                isMockUser = true;
            }
        } catch(e) { /* ignore */ }
    }

    if (!isMockUser && auth.currentUser) {
      await firebaseSignOut(auth);
    }
    // For both Firebase and mock users, clear local state
    setUser(null);
    localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
    router.push('/auth/signin');
    setLoading(false);
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
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

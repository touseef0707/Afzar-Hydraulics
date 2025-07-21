'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/firebase/clientApp';

interface UserContextType {
  user: FirebaseUser | null;
  loading: boolean;
}

export const AuthContext = createContext<UserContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Log when the authentication check begins.
    console.log("[AuthContext] Initializing auth listener...");

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 2a. Log when a user is successfully identified.
        console.log(`[AuthContext] User is LOGGED IN:`, currentUser.email);
        setUser(currentUser);
        
        const token = await currentUser.getIdToken();
        await manageSessionToken(token, 'SET');
      } else {
        // 2b. Log when no user is signed in.
        console.log("[AuthContext] User is LOGGED OUT.");
        setUser(null);
        await manageSessionToken('', 'CLEAR');
      }
      
      setLoading(false);
      // 3. Log when the process is complete and the app can render.
      console.log("[AuthContext] Auth check finished.");
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const manageSessionToken = async (token: string, action: 'SET' | 'CLEAR') => {
    try {
      const response = await fetch('/api/session', {
        method: action === 'SET' ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: action === 'SET' ? JSON.stringify({ token }) : undefined,
      });
      if (!response.ok) throw new Error('Session update failed');
    } catch (error) {
      console.error('Session management error:', error);
    }
  };

  const value = { user, loading };

  // Render children only after the initial auth check is complete.
  // This prevents pages from flashing or showing incorrect states.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


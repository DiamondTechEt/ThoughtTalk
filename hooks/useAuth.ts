import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  displayName?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Check for existing auth session
    // For now, simulate a user being logged in
    setTimeout(() => {
      setUser({
        id: '1',
        email: 'user@example.com',
        displayName: 'Demo User',
        bio: 'This is a demo profile for ThoughtLine',
      });
      setLoading(false);
    }, 1000);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // TODO: Implement actual sign in
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser({
        id: '1',
        email,
        displayName: 'Demo User',
      });
    } catch (error) {
      throw new Error('Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setLoading(true);
      // TODO: Implement actual sign up
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser({
        id: '1',
        email,
        displayName: displayName || 'New User',
      });
    } catch (error) {
      throw new Error('Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual sign out
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
    } catch (error) {
      throw new Error('Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
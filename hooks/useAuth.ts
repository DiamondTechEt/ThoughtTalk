import { useState, useEffect } from 'react';
import { authenticateUser, createUser, getUserById, generateToken, verifyToken } from '@/lib/auth';
import { storeToken, getToken, removeToken } from '@/lib/storage';

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
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await getToken();
      if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
          const userData = await getUserById(decoded.userId);
          if (userData) {
            setUser(userData);
          } else {
            await removeToken();
          }
        } else {
          await removeToken();
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      await removeToken();
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userData = await authenticateUser(email, password);
      if (!userData) {
        throw new Error('Invalid email or password');
      }
      
      const token = generateToken(userData.id);
      await storeToken(token);
      
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setLoading(true);
      const userData = await createUser(email, password, displayName);
      const token = generateToken(userData.id);
      await storeToken(token);
      
      setUser(userData);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        throw new Error('An account with this email already exists');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await removeToken();
      
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
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
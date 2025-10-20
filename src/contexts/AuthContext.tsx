import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apolloClient } from '../lib/apolloClient';
import { jwtDecode } from 'jwt-decode';
import { toast } from "sonner";
import { useAuthSheet } from '@/contexts/auth-sheet';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  user: any | null;
  logout: (alert?: boolean) => void;
  handleAuthError: (error: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  const { openAuth } = useAuthSheet();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoadingUser(false);
      return;
    }

    try {
      const decodedToken: any = jwtDecode(token);

      const currentTime = Date.now() / 1000;
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        logout(false);
        return;
      }

      setIsAuthenticated(true);
      setUser(decodedToken);
      setIsLoadingUser(false);
    } catch (error) {
      console.error('Error decoding token:', error);
      logout(false);
    }
  }, []);

  const logout = (alert: boolean = true) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
    apolloClient.clearStore();

    openAuth('signin');

    if (alert) toast.success('You have been logged out successfully');
  };

  const handleAuthError = (error: any) => {
    console.error('🔒 Auth Error:', error);
    const msg = error?.message || error?.graphQLErrors?.[0]?.message || 'An error occurred';

    if (
      msg.includes('Unauthorized') ||
      msg.includes('unauthenticated') ||
      msg.includes('invalid token') ||
      msg.includes('token expired')
    ) {
      toast.error('Please log in again');
      logout(false);
      return;
    }

    if (msg.includes('Forbidden') || msg.includes('permission')) {
      toast.error('You do not have permission to perform this action');
      return;
    }

    toast.error(msg);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoadingUser, user, logout, handleAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

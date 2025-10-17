import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { apolloClient } from '../lib/apolloClient';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  user: any | null;
  logout: () => void;
  handleAuthError: (error: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoadingUser(false);
      return;
    }

    // fetch current  user with apolloClient
  }, []);

  const logout = (alert: boolean = true) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
    apolloClient.clearStore();
    navigate('/login');
    if (alert) window.alert('You have been logged out successfully');
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
      window.alert('Please log in again');
      logout(false);
      return;
    }

    if (msg.includes('Forbidden') || msg.includes('permission')) {
      window.alert('You do not have permission to perform this action');
      return;
    }

    window.alert(msg)
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

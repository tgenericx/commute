import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client/react';
import { apolloClient } from '../lib/apolloClient';
import {
  CurrentUserDocument,
  type CurrentUserQuery,
} from '../graphql/graphql';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  user: any | null;
  logout: (showToast?: boolean) => void;
  handleAuthError: (error: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  const [fetchUser] = useLazyQuery<CurrentUserQuery>(CurrentUserDocument);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoadingUser(false);
        return;
      }

      try {
        const res = await fetchUser();
        if (res.data?.profile) {
          setUser(res.data.profile);
          setIsAuthenticated(true);
        } else {
          throw new Error('No user data found');
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        handleAuthError(err);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  const logout = (showToast: boolean = true) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
    apolloClient.clearStore();
    navigate('/login');

    if (showToast) {
      toast.success('You have been logged out successfully.');
    }
  };

  const handleAuthError = (error: any) => {
    console.error('🔒 Auth Error:', error);
    const msg =
      error?.message ||
      error?.graphQLErrors?.[0]?.message ||
      'An unexpected error occurred.';

    if (
      msg.toLowerCase().includes('unauthorized') ||
      msg.toLowerCase().includes('unauthenticated') ||
      msg.toLowerCase().includes('invalid token') ||
      msg.toLowerCase().includes('token expired')
    ) {
      toast.error('Session expired. Please log in again.');
      logout(false);
      return;
    }

    if (
      msg.toLowerCase().includes('forbidden') ||
      msg.toLowerCase().includes('permission')
    ) {
      toast.warning('Access denied. You do not have permission for this action.');
      return;
    }

    toast.error(msg);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoadingUser, user, logout, handleAuthError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

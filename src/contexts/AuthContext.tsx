import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client/react';
import { apolloClient } from '../lib/apolloClient';
import {
  CurrentUserDocument,
  type CurrentUserQuery,
} from '../graphql/graphql';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';
import { refreshAccessToken } from '../lib/authUtils';

export type VerifiedToken<T = unknown> = {
  iat?: number;
  exp?: number;
} & T;

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

  const logout = useCallback((showToast: boolean = true) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
    apolloClient.clearStore();
    navigate('/login');

    if (showToast) {
      toast.success('You have been logged out successfully.');
    }
  }, [navigate]);

  const handleAuthError = useCallback(
    (error: any) => {
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
        toast.warning(
          'Access denied. You do not have permission for this action.'
        );
        return;
      }

      toast.error(msg);
    },
    [logout]
  );

  const decodeToken = (token: string): VerifiedToken | null => {
    try {
      return jwtDecode<VerifiedToken>(token);
    } catch (err) {
      console.error('Failed to decode JWT:', err);
      return null;
    }
  };

  const scheduleTokenRefresh = useCallback((exp?: number) => {
    if (!exp) return;

    const now = Date.now();
    const expiresAt = exp * 1000;
    const refreshAt = expiresAt - 5 * 60 * 1000;
    const delay = refreshAt - now;

    if (delay <= 0) return;

    console.log(`⏳ Scheduling token refresh in ${Math.round(delay / 1000)}s`);

    setTimeout(async () => {
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        logout(false);
      } else {
        const newToken = localStorage.getItem('accessToken');
        const newDecoded = newToken ? decodeToken(newToken) : null;
        scheduleTokenRefresh(newDecoded?.exp);
      }
    }, delay);
  }, [logout]);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoadingUser(false);
        return;
      }

      const decoded = decodeToken(token);
      if (!decoded) {
        logout(false);
        setIsLoadingUser(false);
        return;
      }

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn('Access token expired — trying refresh...');
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          logout(false);
          setIsLoadingUser(false);
          return;
        }
      }

      setUser({
        ...decoded,
      });
      setIsAuthenticated(true);

      fetchUser().then((res) => {
        if (res.data?.profile) {
          setUser(res.data.profile);
        }
      });

      scheduleTokenRefresh(decoded.exp);

      setIsLoadingUser(false);
    };

    loadUser();
  }, [fetchUser, logout, scheduleTokenRefresh]);

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


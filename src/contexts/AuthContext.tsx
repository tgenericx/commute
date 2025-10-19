import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { apolloClient } from '../lib/apolloClient';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';
import { refreshAccessToken } from '../lib/authUtils';

export type VerifiedToken<T = unknown> = {
  iat?: number;
  exp?: number;
} & T;

interface AuthContextType<TUser = Record<string, any>> {
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  user: TUser | null;
  logout: (showToast?: boolean) => void;
  handleAuthError: (error: any) => void;
  tryEnsureAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const navigate = useNavigate();

  const decodeToken = useCallback((token: string): VerifiedToken | null => {
    try {
      return jwtDecode<VerifiedToken>(token);
    } catch {
      return null;
    }
  }, []);

  const logout = useCallback(
    (showToast: boolean = true) => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      setUser(null);
      apolloClient.clearStore();
      navigate('/login');

      if (showToast) {
        toast.success('You have been logged out successfully.');
      }
    },
    [navigate]
  );

  const handleAuthError = useCallback(
    (error: any) => {
      console.error('🔒 Auth Error:', error);
      const msg =
        error?.message ||
        error?.graphQLErrors?.[0]?.message ||
        'An unexpected error occurred.';
      const lower = msg.toLowerCase();

      if (
        lower.includes('unauthorized') ||
        lower.includes('unauthenticated') ||
        lower.includes('invalid token') ||
        lower.includes('token expired')
      ) {
        toast.error('Session expired. Please log in again.');
        logout(false);
        return;
      }

      if (lower.includes('forbidden') || lower.includes('permission')) {
        toast.warning('Access denied. You do not have permission for this action.');
        return;
      }

      toast.error(msg);
    },
    [logout]
  );

  const tryEnsureAuth = useCallback(async (): Promise<boolean> => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken && !refreshToken) return false;

    if (!accessToken) {
      const refreshed = await refreshAccessToken();
      if (!refreshed) return false;
      return true;
    }

    const decoded = decodeToken(accessToken);
    if (!decoded?.exp) return false;

    if (decoded.exp * 1000 < Date.now()) {
      const refreshed = await refreshAccessToken();
      return refreshed;
    }

    return true;
  }, [decodeToken]);

  useEffect(() => {
    const init = async () => {
      const ok = await tryEnsureAuth();

      if (!ok) {
        logout(false);
        setIsLoadingUser(false);
        return;
      }

      const newAccess = localStorage.getItem('accessToken');
      const decoded = newAccess ? decodeToken(newAccess) : null;
      if (decoded) setUser(decoded);

      setIsAuthenticated(true);
      setIsLoadingUser(false);
    };

    init();
  }, [tryEnsureAuth, decodeToken, logout]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoadingUser,
        user,
        logout,
        handleAuthError,
        tryEnsureAuth,
      }}
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

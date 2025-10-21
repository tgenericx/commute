import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apolloClient } from "../lib/apolloClient";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useAuthSheet } from "@/contexts/auth-sheet";
import { refreshAccessToken } from "@/lib/authUtils";
import { useNavigate } from "react-router-dom";

export type DecodedToken<T = unknown> = {
  iat?: number;
  exp?: number;
} & T;

interface AuthContextType<TUser = Record<string, any>> {
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  user: TUser | null;
  logout: (showToast?: boolean) => void;
  handleAuthError: (error: any) => void;
  refreshToken: () => Promise<boolean>;
  loginSuccess: (accessToken: string, refreshToken: string) => void; // ✅ new
  redirectPath: string | null; // ✅ new
  setRedirectPath: (path: string | null) => void; // ✅ new
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null); // ✅ new
  const { openAuth } = useAuthSheet();
  const navigate = useNavigate();

  const decodeAndSetUser = (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    const ok = await refreshAccessToken();
    if (ok) {
      const token = localStorage.getItem("accessToken");
      if (token) decodeAndSetUser(token);
      await apolloClient.resetStore();
    }
    return ok;
  };

  // ✅ Handle login success immediately (no reload needed)
  const loginSuccess = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    decodeAndSetUser(accessToken);
    apolloClient.resetStore();
    toast.success("Logged in successfully!");

    // if user tried accessing a protected route before
    if (redirectPath) {
      navigate(redirectPath);
      setRedirectPath(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoadingUser(false);
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          const refreshed = await refreshToken();
          if (!refreshed) {
            logout(false);
            return;
          }
        } else {
          decodeAndSetUser(token);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        logout(false);
      } finally {
        setIsLoadingUser(false);
      }
    };

    initAuth();
  }, []);

  const logout = (alert: boolean = true) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setUser(null);
    apolloClient.clearStore();
    openAuth("signin");
    if (alert) toast.success("You have been logged out successfully");
  };

  const handleAuthError = (error: any) => {
    console.error("🔒 Auth Error:", error);
    const msg =
      error?.message || error?.graphQLErrors?.[0]?.message || "An error occurred";

    if (
      msg.includes("Unauthorized") ||
      msg.includes("unauthenticated") ||
      msg.includes("invalid token") ||
      msg.includes("token expired")
    ) {
      toast.error("Session expired. Refreshing...");
      refreshToken().then((ok) => {
        if (!ok) logout(false);
      });
      return;
    }

    if (msg.includes("Forbidden") || msg.includes("permission")) {
      toast.error("You do not have permission to perform this action");
      return;
    }

    toast.error(msg);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoadingUser,
        user,
        logout,
        handleAuthError,
        refreshToken,
        loginSuccess, // ✅
        redirectPath, // ✅
        setRedirectPath, // ✅
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { apolloClient } from "@/lib/apolloClient";
import { initializeAuth } from "./auth.init";
import { createRefreshManager } from "./refresh-manager";
import { decodeToken, msUntilExpiry, REFRESH_BUFFER_MS } from "./token.utils";
import type { AuthContextType, DecodedToken } from "./types";

export function useAuthProvider(): AuthContextType {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const navigate = useNavigate();

  // --- Mount status tracking ---
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // --- Token refresh scheduling ---
  const refreshTimerRef = useRef<number | null>(null);
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const scheduleRefreshAt = useCallback(
    (expSeconds?: number) => {
      clearRefreshTimer();
      if (!expSeconds) return;

      const msLeft = msUntilExpiry(expSeconds);
      const timeout = Math.max(msLeft - REFRESH_BUFFER_MS, 0);
      console.log(`🔁 LOG: Scheduling token refresh in ${timeout}ms`);

      refreshTimerRef.current = window.setTimeout(() => {
        console.log("🔁 LOG: refresh timer fired; calling refreshTokenOnce()");
        refreshTokenOnceRef.current?.();
      }, timeout);
    },
    [clearRefreshTimer],
  );

  // --- decode + set user ---
  const decodeAndSetUser = useCallback(
    (token: string | null) => {
      console.log("🔒 LOG: decodeAndSetUser called.");
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        clearRefreshTimer();
        return;
      }

      const decoded = decodeToken<DecodedToken>(token);
      if (!decoded?.exp) {
        console.log("❌ LOG: Token missing exp claim.");
        setUser(null);
        setIsAuthenticated(false);
        clearRefreshTimer();
        return;
      }

      const msLeft = msUntilExpiry(decoded.exp);
      if (msLeft <= 0) {
        console.warn("🔒 LOG: Token expired.");
        setUser(null);
        setIsAuthenticated(false);
        clearRefreshTimer();
        return;
      }

      setUser(decoded);
      setIsAuthenticated(true);
      scheduleRefreshAt(decoded.exp);
    },
    [clearRefreshTimer, scheduleRefreshAt],
  );

  // --- Create refresh manager (stable reference) ---
  const { refreshTokenOnce } = useMemo(
    () =>
      createRefreshManager({
        decodeAndSetUser,
        mountedRef,
        clearRefreshTimer,
      }),
    [decodeAndSetUser, clearRefreshTimer],
  );

  // 🔁 hold refreshTokenOnce in a ref to avoid re-renders in scheduleRefreshAt
  const refreshTokenOnceRef = useRef(refreshTokenOnce);
  useEffect(() => {
    refreshTokenOnceRef.current = refreshTokenOnce;
  }, [refreshTokenOnce]);

  // --- Login Success ---
  const loginSuccess = useCallback(
    async (accessToken: string, refreshToken?: string) => {
      console.log("🔑 LOG: loginSuccess called.");
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      decodeAndSetUser(accessToken);

      try {
        await apolloClient.resetStore();
      } catch (err) {
        console.warn("🔑 LOG WARNING: apolloClient.resetStore failed", err);
      }

      if (redirectPath) {
        navigate(redirectPath);
        setRedirectPath(null);
      }
    },
    [decodeAndSetUser, navigate, redirectPath],
  );

  // --- Logout ---
  const logout = useCallback(
    (alert = true) => {
      console.log("👋 LOG: logout called.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      setUser(null);
      clearRefreshTimer();
      apolloClient.clearStore().catch(() => {});
      if (alert) toast.success("You’ve been logged out.");
    },
    [clearRefreshTimer],
  );

  // --- Handle GraphQL auth errors ---
  const handleAuthError = useCallback(
    (error: any) => {
      console.error("🚨 LOG: handleAuthError called:", error);
      const msg =
        (error?.message as string) ||
        (error?.graphQLErrors?.[0]?.message as string) ||
        "Error";
      const lower = msg.toLowerCase();
      if (
        lower.includes("unauthenticated") ||
        lower.includes("expired") ||
        lower.includes("token")
      ) {
        refreshTokenOnceRef.current?.().then((ok) => {
          if (!ok) {
            toast.error("Session expired, please sign in again.");
            logout(false);
          }
        });
      } else {
        toast.error(msg);
      }
    },
    [logout],
  );

  // --- Initialize auth once on mount ---
  useEffect(() => {
    console.log("🚀 LOG: useAuthProvider mount initializing auth...");
    initializeAuth({
      decodeAndSetUser,
      refreshTokenOnce,
      setIsAuthenticated,
      setUser,
      setIsLoadingUser,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ no dependencies — runs once

  // --- Memoized context value ---
  return useMemo(
    () => ({
      isAuthenticated,
      isLoadingUser,
      user,
      logout,
      handleAuthError,
      loginSuccess,
      refreshTokenOnce,
      redirectPath,
      setRedirectPath,
    }),
    [
      isAuthenticated,
      isLoadingUser,
      user,
      logout,
      handleAuthError,
      loginSuccess,
      refreshTokenOnce,
      redirectPath,
    ],
  );
}

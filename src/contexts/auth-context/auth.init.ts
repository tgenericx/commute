import { decodeToken, msUntilExpiry, REFRESH_BUFFER_MS } from "./token.utils";
import type { DecodedToken } from "./types";
import { checkBackendHealth } from "@/lib/refresh-tokens";

export async function initializeAuth({
  decodeAndSetUser,
  refreshTokenOnce,
  setIsAuthenticated,
  setUser,
  setIsLoadingUser,
}: {
  decodeAndSetUser: (token: string | null) => void;
  refreshTokenOnce: () => Promise<boolean>;
  setIsAuthenticated: (v: boolean) => void;
  setUser: (u: any | null) => void;
  setIsLoadingUser: (v: boolean) => void;
}) {
  console.log("🚀 LOG: AuthProvider init - checking stored access token.");

  console.log("🔍 LOG: Checking backend health before auth initialization...");
  const backendHealth = await checkBackendHealth();

  if (!backendHealth) {
    console.error(
      "❌ LOG: Backend is unavailable. Skipping auth initialization.",
    );
    setIsAuthenticated(false);
    setUser(null);
    setIsLoadingUser(false);

    localStorage.setItem("backend_available", "false");
    return;
  }

  console.log(
    "✅ LOG: Backend is healthy. Proceeding with auth initialization.",
  );
  localStorage.setItem("backend_available", "true");

  const token = localStorage.getItem("accessToken");

  if (!token) {
    console.log("🚀 LOG: No access token found; checking refresh token.");
    const refresh = localStorage.getItem("refreshToken");

    if (!refresh) {
      console.log("❌ LOG: No refresh token found; unauthenticated.");
      setIsAuthenticated(false);
      setUser(null);
      setIsLoadingUser(false);
      return;
    }

    console.log(
      `🔄 LOG: Found refresh token (trimmed): ${refresh.slice(0, 8)}...${refresh.slice(-8)}`,
    );
    const decodedRefresh = decodeToken<DecodedToken>(refresh);
    if (!decodedRefresh?.exp) {
      console.log("❌ LOG: Invalid refresh token; no exp claim.");
      setIsAuthenticated(false);
      setUser(null);
      setIsLoadingUser(false);
      return;
    }

    const msLeft = msUntilExpiry(decodedRefresh.exp);
    console.log(
      `🔄 LOG: Refresh token exp=${decodedRefresh.exp}, msLeft=${msLeft}ms`,
    );

    if (msLeft <= 0) {
      console.log("❌ LOG: Refresh token expired.");
      setIsAuthenticated(false);
      setUser(null);
      setIsLoadingUser(false);
      return;
    }

    console.log("🔄 LOG: Refresh token valid; attempting refresh.");
    const ok = await refreshTokenOnce();
    setIsLoadingUser(false);
    if (!ok) {
      console.log("❌ LOG: Refresh failed despite valid refresh token.");
      setIsAuthenticated(false);
      setUser(null);
    }
    return;
  }

  console.log(
    `🚀 LOG: Found access token in storage (trimmed): ${token.slice(0, 8)}...${token.slice(-8)}`,
  );
  const decoded = decodeToken<DecodedToken>(token);
  if (!decoded?.exp) {
    console.log("❌ LOG: Access token missing exp; attempting refresh.");
    await refreshTokenOnce();
    setIsLoadingUser(false);
    return;
  }

  const msLeft = msUntilExpiry(decoded.exp);
  console.log(`🚀 LOG: Access token exp=${decoded.exp}, msLeft=${msLeft}`);

  if (msLeft <= 0 || msLeft <= REFRESH_BUFFER_MS) {
    console.log("🔁 LOG: Token expired or near expiry; attempting refresh.");
    await refreshTokenOnce();
  } else {
    decodeAndSetUser(token);
  }
  setIsLoadingUser(false);
}

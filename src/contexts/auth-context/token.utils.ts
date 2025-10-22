import { jwtDecode } from "jwt-decode";

export const REFRESH_BUFFER_MS = 120_000;

export const msUntilExpiry = (expSeconds?: number) => {
  if (!expSeconds) return Infinity;
  return expSeconds * 1000 - Date.now();
};

export function decodeToken<T = unknown>(token: string) {
  try {
    const decoded = jwtDecode<{ iat?: number; exp?: number } & T>(token);
    console.log("🔒 LOG: Decoded token payload:", decoded);
    return decoded;
  } catch (err) {
    console.warn("🔒 LOG WARNING: Failed to decode token.", err);
    return null;
  }
}

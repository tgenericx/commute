import { checkBackendHealth } from "./health-check";
import { refreshWithClient } from "./refresh-with-client";
import { refreshWithFetch } from "./refresh-with-fetch";

export async function requestTokenRefresh(
  overrideRefreshToken?: string
): Promise<{ accessToken?: string; refreshToken?: string } | null> {
  console.log("🔄 LOG: Starting token refresh...");

  const storedRefreshToken = overrideRefreshToken ?? localStorage.getItem("refreshToken");
  if (!storedRefreshToken) {
    console.warn("🚫 No refresh token found; aborting refresh.");
    return null;
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  const preferred = await checkBackendHealth();
  console.log(`🌐 Health check decided: use ${preferred ?? "none"}`);

  if (!preferred) {
    console.error("❌ Backend unreachable; cannot refresh tokens.");
    return null;
  }

  const result =
    preferred === "client"
      ? await refreshWithClient(storedRefreshToken)
      : await refreshWithFetch(storedRefreshToken);

  if (!result?.accessToken) {
    console.warn(`⚠️ ${preferred} refresh failed, falling back...`);
    return preferred === "client"
      ? await refreshWithFetch(storedRefreshToken)
      : await refreshWithClient(storedRefreshToken);
  }

  console.log("✅ Token refresh successful via", preferred);
  return result;
}

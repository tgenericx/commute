import { checkBackendHealth } from "./health-check";
import { refreshWithClient } from "./refresh-with-client";
import { refreshWithFetch } from "./refresh-with-fetch";

export async function requestTokenRefresh(
  overrideRefreshToken?: string
): Promise<{ accessToken?: string; refreshToken?: string } | null> {
  console.log("🔄 LOG: Starting token refresh...");

  const refreshToken = overrideRefreshToken ?? localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.warn("🚫 No refresh token found; aborting refresh.");
    return null;
  }

  const preferred = await checkBackendHealth();
  console.log(`🌐 Health check decided: use ${preferred ?? "none"}`);

  if (!preferred) {
    console.error("❌ Backend unreachable; cannot refresh tokens.");
    return null;
  }

  const result =
    preferred === "client"
      ? await refreshWithClient(refreshToken)
      : await refreshWithFetch(refreshToken);

  if (result?.accessToken) {
    console.log("✅ Token refresh successful via", preferred);
    return result;
  }

  // Fallback attempt
  if (preferred === "client") {
    console.warn("⚠️ Apollo Client refresh failed, falling back to fetch...");
    return await refreshWithFetch(refreshToken);
  } else {
    console.warn("⚠️ Fetch refresh failed, falling back to Apollo Client...");
    return await refreshWithClient(refreshToken);
  }
}

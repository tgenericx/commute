export { checkBackendHealth } from "./health-check";
import { checkBackendHealth } from "./health-check";
import { refreshWithClient } from "./refresh-with-client";
import { refreshWithFetch } from "./refresh-with-fetch";

let activeRefresh: Promise<{
  accessToken?: string;
  refreshToken?: string;
} | null> | null = null;

export async function requestTokenRefresh(
  overrideRefreshToken?: string,
): Promise<{ accessToken?: string; refreshToken?: string } | null> {
  if (activeRefresh) {
    console.log("⏳ Refresh already in progress; awaiting existing promise...");
    return activeRefresh;
  }

  activeRefresh = (async () => {
    console.log("🔄 LOG: Starting token refresh...");

    const storedRefreshToken =
      overrideRefreshToken ?? localStorage.getItem("refreshToken");
    if (!storedRefreshToken) {
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
  })();

  try {
    return await activeRefresh;
  } finally {
    activeRefresh = null;
  }
}

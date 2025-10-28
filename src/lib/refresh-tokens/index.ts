export { checkBackendHealth } from "./health-check";
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

    const preferred = localStorage.getItem("backend_preferred") as
      | "client"
      | "fetch"
      | null;
    if (!preferred) {
      console.error(
        "❌ Backend unavailable (no preferred method); skipping refresh.",
      );
      return null;
    }

    console.log(`🌐 Using ${preferred} refresh path.`);

    const result =
      preferred === "client"
        ? await refreshWithClient(storedRefreshToken)
        : await refreshWithFetch(storedRefreshToken);

    if (!result?.accessToken) {
      console.warn(`⚠️ ${preferred} refresh failed, falling back...`);
      const fallback = preferred === "client" ? "fetch" : "client";
      return fallback === "client"
        ? await refreshWithClient(storedRefreshToken)
        : await refreshWithFetch(storedRefreshToken);
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

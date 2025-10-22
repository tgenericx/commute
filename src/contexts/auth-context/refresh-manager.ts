import { requestTokenRefresh } from "@/lib/refresh-tokens";

export function createRefreshManager({
  decodeAndSetUser,
  mountedRef,
  clearRefreshTimer,
}: {
  decodeAndSetUser: (token: string | null) => void;
  mountedRef: React.RefObject<boolean>;
  clearRefreshTimer: () => void;
}) {
  let refreshPromise: Promise<boolean> | null = null;

  async function refreshTokenOnce(): Promise<boolean> {
    if (refreshPromise) {
      console.log("🔄 LOG: refreshTokenOnce returning existing in-flight promise.");
      return refreshPromise;
    }

    const p = (async () => {
      console.log("🔄 LOG: refreshTokenOnce started.");
      try {
        const tokens = await requestTokenRefresh();

        if (!tokens?.accessToken) {
          console.log("🔄 LOG: No access token returned; treating as failure.");
          if (mountedRef.current) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            clearRefreshTimer();
          }
          return false;
        }

        if (mountedRef.current) {
          console.log("🔄 LOG: Applying new token to user state.");
          decodeAndSetUser(tokens.accessToken);
        } else {
          console.log("🔄 LOG: Component unmounted; tokens saved only.");
        }

        console.log("🔄 LOG: refreshTokenOnce succeeded.");
        return true;
      } catch (err) {
        console.error("🔄 LOG ERROR: refreshTokenOnce threw:", err);
        return false;
      } finally {
        refreshPromise = null;
      }
    })();

    refreshPromise = p;
    return p;
  }

  return { refreshTokenOnce };
}

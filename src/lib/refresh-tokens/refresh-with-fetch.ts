import { apolloClient } from "../apolloClient";
import {
  RefreshTokensDocument,
  type RefreshTokensMutation,
  type RefreshTokensMutationVariables,
} from "@/graphql/graphql";
import { print } from "graphql";

const GRAPHQL_URL = `${import.meta.env.VITE_API_BASE_URL}/api/graphql`;

export async function refreshWithFetch(
  refreshToken: string,
  retry = 1
): Promise<{ accessToken?: string; refreshToken?: string } | null> {
  const body = JSON.stringify({
    query: print(RefreshTokensDocument),
    variables: { refreshToken } as RefreshTokensMutationVariables,
  });

  const attempt = async (): Promise<{ accessToken?: string; refreshToken?: string } | null> => {
    try {
      const resp = await fetch(GRAPHQL_URL, {
        method: "POST",
        body,
      });

      if (!resp.ok) {
        console.error("❌ Fetch refresh HTTP error", resp.status, resp.statusText);
        return null;
      }

      const json = (await resp.json()) as {
        data?: RefreshTokensMutation;
        errors?: Array<{ message?: string }>;
      };

      if (json.errors?.length) {
        console.error("❌ GraphQL refresh errors (fetch):", json.errors);
        return null;
      }

      const payload = json.data?.refresh;
      if (!payload?.accessToken) {
        console.warn("⚠️ Fetch refresh missing access token.");
        return null;
      }

      const accessToken = payload.accessToken ?? undefined;
      const newRefreshToken = payload.refreshToken ?? undefined;

      localStorage.setItem("accessToken", accessToken);
      if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

      try {
        await apolloClient.resetStore();
      } catch (err) {
        console.warn("⚠️ Apollo resetStore failed after fetch refresh:", err);
      }

      console.log("✅ Token refresh (fetch) succeeded.");
      return { accessToken, refreshToken: newRefreshToken };
    } catch (err) {
      console.error("❌ Network failure during fetch refresh:", err);
      return null;
    }
  };

  // First attempt
  const first = await attempt();
  if (first) return first;

  // Retry once if transient
  if (retry > 0) {
    console.log("🔄 Retrying fetch refresh after delay...");
    await new Promise((r) => setTimeout(r, 800));
    return attempt();
  }

  console.warn("❌ Fetch refresh ultimately failed after retries.");
  return null;
}

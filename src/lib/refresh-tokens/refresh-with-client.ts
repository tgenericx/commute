import { apolloClient } from "../apolloClient";
import {
  RefreshTokensDocument,
  type RefreshTokensMutation,
  type RefreshTokensMutationVariables,
} from "@/graphql/graphql";

/**
 * Refresh tokens using Apollo Client.
 * Returns null on failure.
 */
export async function refreshWithClient(
  refreshToken: string
): Promise<{ accessToken?: string; refreshToken?: string } | null> {
  try {
    const { data } = await apolloClient.mutate<
      RefreshTokensMutation,
      RefreshTokensMutationVariables
    >({
      mutation: RefreshTokensDocument,
      variables: { refreshToken },
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    if (!data || !data.refresh) {
      console.warn("⚠️ Apollo refresh returned no data or refresh field.");
      return null;
    }

    const { accessToken, refreshToken: newRefreshToken } = data.refresh;

    if (!accessToken) {
      console.warn("⚠️ Apollo refresh missing accessToken field.");
      return null;
    }

    // ✅ Persist new tokens
    localStorage.setItem("accessToken", accessToken);
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    try {
      await apolloClient.resetStore();
    } catch (err) {
      console.warn("⚠️ apolloClient.resetStore failed after refresh:", err);
    }

    console.log("✅ Token refresh via Apollo Client succeeded.");
    return {
      accessToken: accessToken ?? undefined,
      refreshToken: newRefreshToken ?? undefined,
    };
  } catch (err) {
    console.error("❌ Apollo Client refresh failed:", err);
    return null;
  }
}

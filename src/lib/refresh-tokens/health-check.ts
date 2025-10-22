import { apolloClient, GRAPHQL_URL } from "../apolloClient";
import { gql } from "@apollo/client/core";

/**
 * Performs a connectivity check to determine which method (Apollo or Fetch)
 * can currently reach the backend.
 */
export async function checkBackendHealth(): Promise<"client" | "fetch" | null> {
  try {
    type HealthCheckQuery = { __typename: string };
    const result = await apolloClient.query<HealthCheckQuery>({
      query: gql`
        {
          __typename
        }
      `,
      fetchPolicy: "no-cache",
    });

    if (result?.data?.__typename) {
      console.log("✅ Health check via Apollo Client succeeded.");
      return "client";
    }
  } catch (err) {
    console.warn("⚠️ Health check via Apollo Client failed:", err);
  }

  try {
    const resp = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{__typename}" }),
    });

    if (resp.ok) {
      console.log("✅ Health check via fetch succeeded.");
      return "fetch";
    } else {
      console.warn("⚠️ Health check via fetch returned:", resp.status);
    }
  } catch (err) {
    console.error("❌ Health check via fetch failed:", err);
  }

  return null;
}

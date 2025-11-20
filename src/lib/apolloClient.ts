import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
} from "@apollo/client/errors";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_BASE_URL || "https://proud-jobyna-campusuniverse-22c402c3.koyeb.app";

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn("⚠️ VITE_API_BASE_URL not set, using default:", API);
}

export { API };

console.log(`🔍 Validating API base URL: ${API}`);
export const GRAPHQL_URL = `${API}/api/graphql`;

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
});
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("accessToken");

  console.log(
    `🔒 LOG: AuthLink executed for operation: ${operation.operationName || "Unnamed"}`,
  );
  console.log("  Variables:", operation.variables);

  operation.setContext(({ headers = {} }) => {
    const authorizationHeader = token ? `Bearer ${token}` : "";

    if (token) {
      console.log(
        "🔒 LOG: Access token found. Attaching Authorization header.",
      );
    } else {
      console.log(
        "🔒 LOG: No access token found. Authorization header will be empty.",
      );
    }

    return {
      headers: {
        ...headers,
        authorization: authorizationHeader,
      },
    };
  });
  return forward(operation);
});

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
      toast.warning(message);
    });
  } else if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) => {
      console.log(
        `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
          extensions,
        )}`,
      );
      toast.warning(message);
    });
  } else {
    console.error(`[Network error]: ${error}`);
  }
});

console.log(
  "🔗 LOG: Assembling Apollo Link chain: [errorLink, authLink, httpLink]",
);
const link = ApolloLink.from([errorLink, authLink, httpLink]);

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

console.log("✅ LOG: Apollo Client initialized.");

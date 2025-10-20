import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
} from "@apollo/client/errors";
import { toast } from "sonner";

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_BASE_URL}/api/graphql`,
  headers: { "Content-Type": "application/json" },
});

const authLink = new SetContextLink(({ headers }) => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
      toast.warning(message)
    });
  } else if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) => {
      console.log(
        `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
          extensions
        )}`
      )
      toast.warning(message)
    });
  } else {
    console.error(`[Network error]: ${error}`);
  }
});

const link = ApolloLink.from([errorLink, authLink, httpLink])

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

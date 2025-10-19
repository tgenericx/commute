import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
} from '@apollo/client/errors';
import { toast } from 'sonner';

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_BASE_URL}/api/graphql`,
  headers: { 'Content-Type': 'application/json' },
});

const authLink = new SetContextLink(({ headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const { message, extensions } of error.errors) {
      const code = extensions?.code;
      const lowerMsg = message.toLowerCase();

      if (
        code === 'UNAUTHENTICATED' ||
        lowerMsg.includes('invalid token') ||
        lowerMsg.includes('token expired')
      ) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return;
      }

      if (code === 'FORBIDDEN' || lowerMsg.includes('forbidden')) {
        toast.warning('Access denied. You do not have permission for this action.');
        return;
      }

      console.error(`[GraphQL error]: Message: ${message}`);
    }
  } else if (CombinedProtocolErrors.is(error)) {
    for (const { message, extensions } of error.errors) {
      console.error(
        `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
          extensions
        )}`
      );
    }
  } else {
    console.error(`[Network error]: ${error}`);
    toast.error('Network error. Please check your connection.');
  }
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

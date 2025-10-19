import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
} from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
} from '@apollo/client/errors';
import { toast } from 'sonner';
import { refreshAccessToken } from './authUtils';

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

let isRefreshing = false;
let pendingRequests: ((success: boolean) => void)[] = [];

const resolvePendingRequests = (success: boolean) => {
  pendingRequests.forEach((cb) => cb(success));
  pendingRequests = [];
};

const waitForTokenRefresh = () =>
  new Promise<boolean>((resolve) => {
    pendingRequests.push((success) => resolve(success));
  });

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const { message, extensions } of error.errors) {
      const code = extensions?.code;
      const lowerMsg = message.toLowerCase();

      if (
        code === 'UNAUTHENTICATED' ||
        lowerMsg.includes('invalid token') ||
        lowerMsg.includes('token expired')
      ) {
        if (!isRefreshing) {
          isRefreshing = true;

          const refreshPromise = refreshAccessToken()
            .then((success) => {
              if (!success) throw new Error('Token refresh failed');
              resolvePendingRequests(true);
            })
            .catch(() => {
              resolvePendingRequests(false);
              pendingRequests = [];

              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');

              toast.error('Session expired. Please log in again.');
              window.location.href = '/login';
            })
            .finally(() => {
              isRefreshing = false;
            });

          return new Observable((observer) => {
            refreshPromise
              .then(() => {
                const sub = forward(operation).subscribe(observer);
                return () => sub.unsubscribe();
              })
              .catch((err) => observer.error(err));
          });
        }

        return new Observable((observer) => {
          waitForTokenRefresh().then((success) => {
            if (!success) {
              observer.error(new Error('Token refresh failed'));
              return;
            }

            const sub = forward(operation).subscribe(observer);
            return () => sub.unsubscribe();
          });
        });
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

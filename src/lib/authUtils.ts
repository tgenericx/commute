import { apolloClient } from './apolloClient';
import {
  RefreshTokensDocument,
  type RefreshTokensMutation,
  type RefreshTokensMutationVariables,
} from '../graphql/graphql';

export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const res = await apolloClient.mutate<
      RefreshTokensMutation,
      RefreshTokensMutationVariables
    >({
      mutation: RefreshTokensDocument,
      variables: { refreshToken },
      fetchPolicy: 'no-cache',
    });

    const newAccess = res.data?.refresh?.accessToken;
    const newRefresh = res.data?.refresh?.refreshToken;

    if (newAccess) {
      localStorage.setItem('accessToken', newAccess);
      if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
      return true;
    }

    return false;
  } catch (err) {
    console.error('🔁 Token refresh failed:', err);
    return false;
  }
};

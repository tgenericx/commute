export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation RefreshTokens($refreshToken: String!) {
            refresh(refreshToken: $refreshToken) {
              accessToken
              refreshToken
            }
          }
        `,
        variables: { refreshToken },
      }),
    });

    const json = await res.json();

    const newAccess = json.data?.refresh?.accessToken;
    const newRefresh = json.data?.refresh?.refreshToken;

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

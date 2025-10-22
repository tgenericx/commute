export type DecodedToken<T = unknown> = { iat?: number; exp?: number } & T;

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  user: any | null;
  logout: (alert?: boolean) => void;
  handleAuthError: (error: any) => void;
  loginSuccess: (accessToken: string, refreshToken?: string) => Promise<void>;
  refreshTokenOnce: () => Promise<boolean>;
  redirectPath: string | null;
  setRedirectPath: (path: string | null) => void;
}

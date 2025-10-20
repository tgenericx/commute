import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAuthSheet } from "../contexts/auth-sheet";

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, isLoadingUser } = useAuth();
  const { openAuth } = useAuthSheet();

  useEffect(() => {
    if (!isLoadingUser && !isAuthenticated) {
      openAuth("signin");
    }
  }, [isLoadingUser, isAuthenticated, openAuth]);

  if (isLoadingUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span className="text-muted-foreground">Verifying session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

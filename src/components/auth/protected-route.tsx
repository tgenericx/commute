import { useAuth } from "@/contexts/auth-context";
import { Navigate } from "react-router-dom";
import { Spinner } from "../ui/spinner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return <AuthLoader />;
  }

  return isAuthenticated ? children : <Navigate to="/landing" replace />;
};

export function AuthLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-8 h-8" />
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    </div>
  );
}

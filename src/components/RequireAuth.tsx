import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { useAuthSheet } from "@/contexts/auth-sheet";
import { useLocation } from "react-router-dom";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoadingUser, setRedirectPath } = useAuth();
  const { openAuth } = useAuthSheet();
  const location = useLocation();

  useEffect(() => {
    // Sole responsibility here: check auth status and, if unauthenticated,
    // open the sign-in UI and store the redirect path. Token refresh is
    // handled entirely inside the AuthContext (AuthProvider).
    if (!isLoadingUser && !isAuthenticated) {
      console.log(`🔒 GUARD LOG: User unauthenticated; opening signin for path ${location.pathname}`);
      setRedirectPath(location.pathname);
      openAuth("signin");
    }
  }, [isLoadingUser, isAuthenticated, location.pathname, setRedirectPath, openAuth]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {isLoadingUser ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-muted-foreground"
          >
            Verifying session...
          </motion.div>
        ) : !isAuthenticated ? (
          <motion.div
            key="unauth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-muted-foreground"
          >
            Authenticating...
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

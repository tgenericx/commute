import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useAuthSheet } from "../contexts/auth-sheet";
import { useLocation } from "react-router-dom";

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, isLoadingUser, setRedirectPath } = useAuth();
  const { openAuth } = useAuthSheet();
  const location = useLocation();

  useEffect(() => {
    if (!isLoadingUser && !isAuthenticated) {
      setRedirectPath(location.pathname); // ✅ remember where user wanted to go
      openAuth("signin");
    }
  }, [isLoadingUser, isAuthenticated, location.pathname]);

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

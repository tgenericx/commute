import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface AuthSheetContextValue {
  open: boolean;
  openAuth: (page?: "signin" | "signup") => void;
  closeAuth: () => void;
  page: "signin" | "signup";
  setPage: (page: "signin" | "signup") => void;
}

const AuthSheetContext = createContext<AuthSheetContextValue | null>(null);

export const AuthSheetProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<"signin" | "signup">("signin");

  const openAuth = useCallback((p?: "signin" | "signup") => {
    if (p) setPage(p);
    setOpen(true);
  }, []);

  const closeAuth = useCallback(() => setOpen(false), []);

  return (
    <AuthSheetContext.Provider value={{ open, openAuth, closeAuth, page, setPage }}>
      {children}
    </AuthSheetContext.Provider>
  );
};

export const useAuthSheet = () => {
  const ctx = useContext(AuthSheetContext);
  if (!ctx) throw new Error("useAuthSheet must be used within <AuthSheetProvider>");
  return ctx;
};

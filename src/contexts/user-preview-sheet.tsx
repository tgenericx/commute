import { createContext, useContext } from "react";

export interface UserPreviewSheetContextValue {
  open: boolean;
  userRef: { id?: string; username?: string } | null;
  openSheet: (ref: { id?: string; username?: string }) => void;
  closeSheet: () => void;
}

export const UserPreviewSheetContext =
  createContext<UserPreviewSheetContextValue | null>(null);

export const useUserPreviewSheet = () => {
  const ctx = useContext(UserPreviewSheetContext);
  if (!ctx)
    throw new Error(
      "useUserPreviewSheet must be used within UserPreviewSheetProvider",
    );
  return ctx;
};

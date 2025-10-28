import { createContext, useContext } from "react";
import { GetUserProfileQuery } from "@/graphql/graphql";

export interface UserPreviewSheetContextValue {
  open: boolean;
  user: GetUserProfileQuery["user"] | null;
  loading?: boolean;
  openSheet: (userId: string) => void;
  closeSheet: () => void;
}

export const UserPreviewSheetContext =
  createContext<UserPreviewSheetContextValue | null>(null);

export const useUserPreviewSheet = () => {
  const ctx = useContext(UserPreviewSheetContext);
  if (!ctx)
    throw new Error("useUserPreviewSheet must be used within its Provider");
  return ctx;
};

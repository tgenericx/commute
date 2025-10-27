import { createContext, useContext } from "react";
import { User } from "@/graphql/graphql";

export interface UserPreviewSheetContextValue {
  open: boolean;
  user: Pick<
    User,
    "id" | "name" | "username" | "avatar" | "bio" | "_count" | "campusProfile"
  > | null;
  openSheet: (user: UserPreviewSheetContextValue["user"]) => void;
  closeSheet: () => void;
}

export const UserPreviewSheetContext =
  createContext<UserPreviewSheetContextValue | null>(null);

export const useUserPreviewSheet = () => {
  const ctx = useContext(UserPreviewSheetContext);
  if (!ctx) {
    throw new Error(
      "useUserPreviewSheet must be used within UserPreviewSheetProvider",
    );
  }
  return ctx;
};

import { ReactNode, useState } from "react";
import {
  UserPreviewSheetContext,
  UserPreviewSheetContextValue,
} from "@/contexts/user-preview-sheet";

interface UserPreviewSheetProviderProps {
  children: ReactNode;
}

export const UserPreviewSheetProvider = ({
  children,
}: UserPreviewSheetProviderProps) => {
  const [state, setState] = useState<{
    open: boolean;
    user: UserPreviewSheetContextValue["user"];
  }>({
    open: false,
    user: null,
  });

  const openSheet = (user: UserPreviewSheetContextValue["user"]) => {
    setState({ open: true, user });
  };

  const closeSheet = () => {
    setState({ open: false, user: null });
  };

  const value: UserPreviewSheetContextValue = {
    open: state.open,
    user: state.user,
    openSheet,
    closeSheet,
  };

  return (
    <UserPreviewSheetContext.Provider value={value}>
      {children}
    </UserPreviewSheetContext.Provider>
  );
};

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
    userRef: UserPreviewSheetContextValue["userRef"];
  }>({
    open: false,
    userRef: null,
  });

  const openSheet = (ref: { id?: string; username?: string }) => {
    setState({ open: true, userRef: ref });
  };

  const closeSheet = () => {
    setState({ open: false, userRef: null });
  };

  const value: UserPreviewSheetContextValue = {
    open: state.open,
    userRef: state.userRef,
    openSheet,
    closeSheet,
  };

  return (
    <UserPreviewSheetContext.Provider value={value}>
      {children}
    </UserPreviewSheetContext.Provider>
  );
};

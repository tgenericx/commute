import { ReactNode, useState } from "react";
import {
  UserPreviewSheetContext,
  UserPreviewSheetContextValue,
} from "@/contexts/user-preview-sheet";
import { useQuery } from "@apollo/client/react";
import { GetUserProfileDocument } from "@/graphql/graphql";

interface UserPreviewSheetProviderProps {
  children: ReactNode;
}

export const UserPreviewSheetProvider = ({
  children,
}: UserPreviewSheetProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { data, loading } = useQuery(GetUserProfileDocument, {
    variables: { id: userId || "" },
    skip: !open || !userId,
  });

  const openSheet = (id: string) => {
    setUserId(id);
    setOpen(true);
  };

  const closeSheet = () => {
    setOpen(false);
    setUserId(null);
  };

  const value: UserPreviewSheetContextValue = {
    open,
    user: data?.user || null,
    loading,
    openSheet,
    closeSheet,
  };

  return (
    <UserPreviewSheetContext.Provider value={value}>
      {children}
    </UserPreviewSheetContext.Provider>
  );
};

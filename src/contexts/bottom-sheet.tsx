import { createContext, useContext } from "react";

export interface BottomSheetContextValue {
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export const useBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) throw new Error("useBottomSheet must be used within <BottomSheet>");
  return ctx;
};

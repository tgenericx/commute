import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";

export type SnapPoint = "full" | "half" | "closed";

export interface BottomSheetContextValue {
  open: boolean;
  y: MotionValue<number>;
  snapTo: (point: SnapPoint) => void;
  onOpen?: () => void;
  onClose: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export const useBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) throw new Error("useBottomSheet must be used within <BottomSheet>");
  return ctx;
};

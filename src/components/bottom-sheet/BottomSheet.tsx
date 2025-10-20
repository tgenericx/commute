import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { createContext, useContext, useRef } from "react";
import { cn } from "../lib/utils";

interface BottomSheetContextType {
  onClose: () => void;
  controls: ReturnType<typeof useDragControls>;
}

const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

export const useBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) throw new Error("useBottomSheet must be used inside <BottomSheet>");
  return ctx;
};

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet = ({ open, onClose, children }: BottomSheetProps) => {
  const controls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);

  return (
    <BottomSheetContext.Provider value={{ onClose, controls }}>
      <AnimatePresence>
        {open && (
          <>
            {children}
          </>
        )}
      </AnimatePresence>
    </BottomSheetContext.Provider>
  );
};

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useDragControls,
} from "framer-motion";
import { createContext, useContext, useRef } from "react";

interface BottomSheetContextType {
  onClose: () => void;
  controls: ReturnType<typeof useDragControls>;
  y: any;
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
  const y = useSpring(useMotionValue(0), {
    stiffness: 400,
    damping: 35,
  });

  return (
    <BottomSheetContext.Provider value={{ onClose, controls, y }}>
      <AnimatePresence>{open && children}</AnimatePresence>
    </BottomSheetContext.Provider>
  );
};

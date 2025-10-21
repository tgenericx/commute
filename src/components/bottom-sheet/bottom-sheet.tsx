import { BottomSheetContext } from "@/contexts/bottom-sheet";
import { motion, AnimatePresence } from "framer-motion";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  children: React.ReactNode;
}

export const BottomSheet = ({
  open,
  onClose,
  onOpen,
  onDragStart,
  onDragEnd,
  children,
}: BottomSheetProps) => {
  return (
    <BottomSheetContext.Provider
      value={{ open, onClose, onOpen, onDragStart, onDragEnd }}
    >
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* The House */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 text-white rounded-t-2xl shadow-xl"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragStart={onDragStart}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) onClose();
                onDragEnd?.();
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </BottomSheetContext.Provider>
  );
};

import { motion } from "framer-motion";
import { useBottomSheet } from "./BottomSheet";
import { cn } from "@/lib/utils";

export const BottomSheetContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { onClose, controls } = useBottomSheet();

  return (
    <motion.div
      drag="y"
      dragControls={controls}
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 120) onClose();
      }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-xl border border-border p-4 flex flex-col",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

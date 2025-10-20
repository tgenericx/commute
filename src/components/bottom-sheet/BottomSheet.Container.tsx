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
  const { onClose, controls, y } = useBottomSheet();

  return (
    <motion.div
      drag="y"
      style={{ y }}
      dragControls={controls}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.y > 150) onClose();
        else y.set(0); // snap back
      }}
      dragConstraints={{ top: 0 }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl border border-border p-4 flex flex-col",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

import { motion, useTransform } from "framer-motion";
import { useBottomSheet } from "./BottomSheet";

export const BottomSheetOverlay = () => {
  const { onClose, y } = useBottomSheet();

  const opacity = useTransform(y, [0, 300], [1, 0]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      style={{ opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    />
  );
};

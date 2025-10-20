import { motion } from "framer-motion";
import { useBottomSheet } from "./BottomSheet";

export const BottomSheetOverlay = () => {
  const { onClose } = useBottomSheet();

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    />
  );
};

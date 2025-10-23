import { BottomSheetContext, type SnapPoint } from "@/contexts/bottom-sheet";
import { motion, AnimatePresence, useMotionValue, animate, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useHaptics } from "@/hooks/use-haptics";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet = ({ open, onClose, children }: BottomSheetProps) => {
  const y = useMotionValue(0);
  const [height, setHeight] = useState(0);
  const { trigger } = useHaptics();
  const sheetRef = useRef<HTMLDivElement>(null);

  const SNAP_POINTS = {
    FULL: 0,
    HALF: 0.6, // 60% of the screen height
    CLOSED: 1,
  };

  const overlayOpacity = useTransform(y, [0, height], [1, 0]);

  useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  const snapTo = (point: SnapPoint) => {
    let target = 0;
    switch (point) {
      case "half":
        target = height * SNAP_POINTS.HALF;
        break;
      case "closed":
        target = height * SNAP_POINTS.CLOSED;
        setTimeout(onClose, 150);
        break;
      default:
        target = SNAP_POINTS.FULL;
    }

    trigger("medium")
    animate(y, target, { type: "spring", stiffness: 300, damping: 30 });
  };

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;
    const threshold = height * 0.25;

    if (offset > threshold || velocity > 800) {
      trigger("medium")
      animate(y, height, { type: "spring", stiffness: 300, damping: 30 });
      setTimeout(onClose, 150);
      return;
    }

    const halfPoint = height * SNAP_POINTS.HALF;
    const current = y.get();
    const target =
      Math.abs(current - SNAP_POINTS.FULL * height) <
        Math.abs(current - halfPoint)
        ? SNAP_POINTS.FULL * height
        : halfPoint;

    trigger("medium")
    animate(y, target, { type: "spring", stiffness: 300, damping: 30 });
  };

  return (
    <BottomSheetContext.Provider value={{ open, onClose, snapTo, y }}>
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={onClose}
              style={{ opacity: overlayOpacity }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sheet */}
            <motion.div
              ref={sheetRef}
              className="fixed left-0 right-0 bottom-0 z-50 bg-neutral-900 text-white rounded-t-2xl shadow-2xl overflow-hidden"
              style={{ y }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Handle */}
              <div className="flex items-center justify-center py-2">
                <div className="w-10 h-1.5 bg-neutral-700 rounded-full" />
              </div>

              {/* Scrollable Content */}
              <div className="max-h-[80vh] overflow-y-auto overscroll-contain p-4">
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </BottomSheetContext.Provider>
  );
};

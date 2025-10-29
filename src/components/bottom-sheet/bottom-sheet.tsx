import { BottomSheetContext, type SnapPoint } from "@/contexts/bottom-sheet";
import { motion, AnimatePresence, useMotionValue, animate, useTransform, useDragControls } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { useHaptics } from "@/hooks/use-haptics";

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
  children
}: BottomSheetProps) => {
  const y = useMotionValue(0);
  const [height, setHeight] = useState(0);
  const { trigger } = useHaptics();
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const SNAP_POINTS = {
    FULL: 0,
    HALF: 0.6,
    CLOSED: 1,
  } as const;

  const overlayOpacity = useTransform(y, [0, height], [1, 0]);

  useEffect(() => {
    const updateHeight = () => setHeight(window.innerHeight);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    if (open && onOpen) {
      onOpen();
    }
  }, [open, onOpen]);

  const snapTo = useCallback((point: SnapPoint) => {
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

    trigger("medium");
    animate(y, target, { type: "spring", stiffness: 300, damping: 30 });
  }, [height, onClose, trigger, y]);

  const handleDragEnd = useCallback((_: any, info: any) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;
    const currentY = y.get();

    onDragEnd?.();

    if (offset > height * 0.4 || velocity > 1000) {
      trigger("medium");
      snapTo("closed");
      return;
    }

    const halfPoint = height * SNAP_POINTS.HALF;
    const shouldSnapToHalf = Math.abs(currentY - halfPoint) < Math.abs(currentY);

    trigger("light");
    snapTo(shouldSnapToHalf ? "half" : "full");
  }, [height, onDragEnd, snapTo, trigger, y]);

  const handleDragStart = useCallback(() => {
    onDragStart?.();
  }, [onDragStart]);

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
              role="dialog"
              aria-modal="true"
            />

            {/* Sheet */}
            <motion.div
              ref={sheetRef}
              className="fixed left-0 right-0 bottom-0 z-50 bg-neutral-900 text-white rounded-t-2xl shadow-2xl overflow-hidden"
              style={{ y }}
              drag="y"
              dragControls={dragControls}
              dragConstraints={{ top: -height * 0.2, bottom: height }}
              dragElastic={0.1}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Handle */}
              <div
                className="flex items-center justify-center py-2"
                // Only start the sheet drag when the handle receives the pointer down.
                onPointerDown={(e) => {
                  // forward the pointer event to the drag controls so dragging begins from here
                  // cast to any because React's PointerEvent differs from the native PointerEvent signature expected by framer-motion
                  dragControls.start(e as any);
                }}
                aria-label="Drag handle"
              >
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

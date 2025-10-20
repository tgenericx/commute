import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import clsx from "clsx";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: string;
  bgClassName?: string;
  fullHeight?: boolean;
  className?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  maxHeight = "90vh",
  bgClassName = "bg-neutral-900",
  fullHeight = false,
  className,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string | number>("auto");

  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 150], [1, 0.4]);
  const scale = useTransform(y, [0, 200], [1, 0.95]);

  useEffect(() => {
    if (!contentRef.current || fullHeight) return;

    const resizeObserver = new ResizeObserver(() => {
      const contentHeight = contentRef.current?.scrollHeight || 0;
      const windowHeight = window.innerHeight;
      const safeHeight = Math.min(contentHeight + 48, windowHeight * 0.95);
      setHeight(safeHeight);
    });

    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, [fullHeight]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dim overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-40"
            style={{ opacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            className={clsx(
              "fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl overflow-hidden flex flex-col shadow-xl",
              bgClassName,
              className
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            style={{
              y,
              scale,
              height: fullHeight ? "100vh" : height,
              maxHeight,
              paddingBottom: "env(safe-area-inset-bottom)",
              touchAction: "none",
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const shouldClose = info.offset.y > 120 || info.velocity.y > 800;
              if (shouldClose) onClose();
              else y.set(0);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="flex items-center justify-center py-2 border-b border-neutral-800 relative">
              <div className="w-10 h-1 bg-neutral-700 rounded-full" />
            </div>

            {/* Content */}
            <div ref={contentRef} className="overflow-y-auto flex-1">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ResourceType } from "@/graphql/graphql";
import { MiniMediaData } from "./thumbnail";

interface MediaLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: MiniMediaData[];
  startIndex?: number;
}

const MediaLightbox: React.FC<MediaLightboxProps> = ({
  isOpen,
  onClose,
  mediaList,
  startIndex = 0,
}) => {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (isOpen) setIndex(startIndex);
  }, [isOpen, startIndex]);

  const handleNext = () => setIndex((prev) => (prev + 1) % mediaList.length);
  const handlePrev = () =>
    setIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const current = mediaList[index];
  if (!current) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 rounded-t-2xl overflow-hidden flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose();
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ height: "70vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-neutral-800 relative">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-neutral-700 rounded-full" />
              <button
                onClick={onClose}
                className="ml-auto p-2 hover:bg-neutral-800 rounded-full"
                aria-label="Close"
              >
                <X className="text-neutral-300 w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 relative flex items-center justify-center p-4">
              {/* Swipe container */}
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex justify-center"
                >
                  {current.resourceType === ResourceType.Video ? (
                    <video
                      src={current.secureUrl}
                      controls
                      className="w-full max-h-full rounded-lg object-contain"
                    />
                  ) : (
                    <img
                      src={current.secureUrl}
                      alt="media"
                      className="w-full max-h-full rounded-lg object-contain"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              {mediaList.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="text-white w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full"
                    aria-label="Next"
                  >
                    <ChevronRight className="text-white w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Footer indicator */}
            {mediaList.length > 1 && (
              <div className="flex justify-center gap-2 pb-3">
                {mediaList.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-white" : "bg-neutral-600"
                      }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MediaLightbox;

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ResourceType } from "@/graphql/graphql";
import { useRegisterSheet } from "@/hooks/use-register-sheet";

interface MediaLightboxSheetProps {
  mediaList: {
    id: string;
    resourceType: ResourceType;
    secureUrl: string;
  }[];
  startIndex?: number;
  onClose: () => void;
}

const MediaLightboxSheetContent: React.FC<MediaLightboxSheetProps> = ({
  mediaList,
  startIndex = 0,
  onClose,
}) => {
  const [index, setIndex] = useState(startIndex);

  const handleNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % mediaList.length);
  }, [mediaList.length]);

  const handlePrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  }, [mediaList.length]);

  const handlersRef = useRef({ onClose, handleNext, handlePrev });

  useEffect(() => {
    handlersRef.current = { onClose, handleNext, handlePrev };
  }, [onClose, handleNext, handlePrev]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handlersRef.current.onClose();
      if (e.key === "ArrowRight") handlersRef.current.handleNext();
      if (e.key === "ArrowLeft") handlersRef.current.handlePrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  const current = mediaList[index];
  if (!current) return null;

  return (
    <div className="relative flex flex-col items-center justify-center space-y-4 py-4">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center items-center w-full h-full"
        >
          {current.resourceType === ResourceType.Video ? (
            <video
              src={current.secureUrl}
              controls
              className="max-w-full max-h-[70vh] rounded-lg object-contain"
            />
          ) : (
            <img
              src={current.secureUrl}
              alt="media"
              className="max-w-full max-h-[70vh] rounded-lg object-contain"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
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

      {/* Indicators */}
      {mediaList.length > 1 && (
        <div className="flex justify-center gap-2 pb-3">
          {mediaList.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? "bg-white" : "bg-neutral-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const MediaLightboxSheet = () => {
  useRegisterSheet("media-lightbox", (props, onClose) => {
    return (
      <MediaLightboxSheetContent
        mediaList={props.media}
        startIndex={props.startIndex}
        onClose={onClose}
      />
    );
  });
  return null;
};

export default MediaLightboxSheet;

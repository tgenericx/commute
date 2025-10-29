import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ResourceType } from "@/graphql/graphql";
import { useRegisterSheet } from "@/hooks/use-register-sheet";
import { AdaptedMedia } from "./types";

interface MediaLightboxSheetProps {
  mediaList: AdaptedMedia[];
  startIndex?: number;
  onClose: () => void;
}

const MediaLightboxSheetContent: React.FC<MediaLightboxSheetProps> = ({
  mediaList,
  startIndex = 0,
  onClose,
}) => {
  const [index, setIndex] = useState(startIndex);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  // restore index if startIndex changes
  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  // prevent background scroll while lightbox is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // focus the container for keyboard users
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const current = mediaList[index];
  if (!current) return null;

  const mediaKey = `${current.secureUrl ?? "media"}-${index}`;

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      className="relative flex flex-col items-center justify-center space-y-4 py-4 outline-none"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={mediaKey}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center items-center w-full h-full"
        >
          {current.resourceType === ResourceType.Video ? (
            <video
              src={current.playbackUrl || current.secureUrl}
              controls
              className="max-w-full max-h-[70vh] rounded-lg object-contain"
            />
          ) : (
            <img
              src={current.secureUrl}
              alt={current.format ?? "Media"}
              className="max-w-full max-h-[70vh] rounded-lg object-contain"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-3 top-3 p-2 bg-black/30 hover:bg-black/50 rounded-full"
        aria-label="Close"
        title="Close"
      >
        <X className="text-white w-5 h-5" />
      </button>

      {/* Navigation */}
      {mediaList.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full"
            aria-label="Previous"
            title="Previous"
          >
            <ChevronLeft className="text-white w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full"
            aria-label="Next"
            title="Next"
          >
            <ChevronRight className="text-white w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {mediaList.length > 1 && (
        <div className="flex justify-center gap-2 pb-3">
          {mediaList.map((_, i) => (
            <button
              key={`${i}-${_?.secureUrl ?? "media"}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to media ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? "bg-white" : "bg-neutral-600"
              }`}
              title={`Go to media ${i + 1}`}
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

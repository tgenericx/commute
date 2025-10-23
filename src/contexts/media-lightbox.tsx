import React, { createContext, useContext, useState, useCallback } from "react";
import { AdaptedMedia } from "@/components/media/types";

interface MediaLightboxContextValue {
  open: (mediaList: AdaptedMedia[], startIndex?: number) => void;
  close: () => void;
  isOpen: boolean;
  mediaList: AdaptedMedia[];
  startIndex: number;
}

const MediaLightboxContext = createContext<MediaLightboxContextValue | null>(null);

export const MediaLightboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaList, setMediaList] = useState<AdaptedMedia[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  const open = useCallback((list: AdaptedMedia[], start = 0) => {
    setMediaList(list);
    setStartIndex(start);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <MediaLightboxContext.Provider value={{ open, close, isOpen, mediaList, startIndex }}>
      {children}
    </MediaLightboxContext.Provider>
  );
};

export const useMediaLightbox = () => {
  const ctx = useContext(MediaLightboxContext);
  if (!ctx) throw new Error("useMediaLightbox must be used within <MediaLightboxProvider>");
  return ctx;
};

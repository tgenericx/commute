import React, { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LightboxProps } from "./types";

export const Lightbox: React.FC<LightboxProps> = ({
  media,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = media[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onPrev();
      if (e.key === "ArrowRight" && currentIndex < media.length - 1) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, media.length, onClose, onNext, onPrev]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = current.src;
    link.download = current.title;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: current.title,
          url: current.src,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(current.src);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="secondary" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="secondary" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button size="icon" variant="secondary" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Badge variant="secondary" className="text-sm">
          {currentIndex + 1} / {media.length}
        </Badge>
      </div>

      <div className="h-full flex items-center justify-center p-4">
        {current.type === "image" ? (
          <img
            src={current.src}
            alt={current.title}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            src={current.src}
            className="max-h-full max-w-full object-contain"
            controls
            autoPlay
          />
        )}
      </div>

      {currentIndex > 0 && (
        <Button
          size="icon"
          variant="secondary"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full"
          onClick={onPrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}

      {currentIndex < media.length - 1 && (
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full"
          onClick={onNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-2xl w-full px-4">
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-1">{current.title}</h3>
            <p className="text-sm text-muted-foreground">
              {current.type === "video" ? "Video" : "Image"} •{" "}
              {current.type === "video" ? "Click to play" : "Full resolution"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

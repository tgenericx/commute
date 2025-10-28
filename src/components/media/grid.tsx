import React, { useCallback } from "react";
import MediaThumbnail from "./thumbnail";
import { AdaptedMedia } from "./types";
import { cn } from "@/lib/utils";
import { useSheetManager } from "@/contexts/sheet-manager";

interface MediaGridProps {
  media: AdaptedMedia[];
  className?: string;
  rounded?: boolean;
  bordered?: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({
  media,
  className = "",
  rounded,
  bordered,
}) => {
  if (!media.length) return null;

  const { openSheet } = useSheetManager();
  const radius = rounded ? "rounded-2xl" : "";
  const borderStyle = bordered
    ? "border border-border dark:border-neutral-800"
    : "";

  const handleOpenLightbox = useCallback(
    (startIndex: number) => {
      openSheet("mediaLightbox", { media, startIndex });
    },
    [openSheet, media],
  );

  if (media.length === 1) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-muted dark:bg-muted/30",
          radius,
          borderStyle,
          className,
        )}
      >
        <MediaThumbnail
          media={media[0]}
          className="aspect-square hover:opacity-90 transition-opacity"
          onClick={() => handleOpenLightbox(0)}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "grid grid-cols-2 gap-2 bg-muted/50 dark:bg-muted/20 p-1",
          radius,
          borderStyle,
          className,
        )}
      >
        {media.slice(0, 4).map((item, i) => (
          <div key={item.id} className="relative overflow-hidden">
            <MediaThumbnail
              media={item}
              className="aspect-square hover:opacity-90 transition-opacity"
              onClick={() => handleOpenLightbox(i)}
            />
          </div>
        ))}

        {media.length > 4 && (
          <div className="absolute bottom-2 right-2 bg-background/80 dark:bg-background/60 text-foreground/90 text-xs px-2 py-1 rounded-md">
            +{media.length - 4}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGrid;

import React, { useCallback } from "react";
import MediaThumbnail from "./thumbnail";
import { cn } from "@/lib/utils";
import { useSheetManager } from "@/contexts/sheet-manager";
import { AspectRatio } from "../ui/aspect-ratio";
import { Media } from "@/graphql/graphql";

interface MediaGridProps {
  media: Media[];
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
  if (!media || media.length === 0) return null;

  const { openSheet } = useSheetManager();
  const radius = rounded ? "rounded-2xl" : "";
  const borderStyle = bordered
    ? "border border-border dark:border-neutral-800"
    : "";

  const handleOpenLightbox = useCallback(
    (startIndex: number) => {
      openSheet("media-lightbox", { media, startIndex });
    },
    [openSheet, media],
  );

  // For single media: allow click to open media-lightbox, but stop event propagation
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
          onClick={(e?: React.MouseEvent) => {
            e?.stopPropagation();
            handleOpenLightbox(0);
          }}
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
          <AspectRatio key={`${item.secureUrl ?? "media"}-${i}`} ratio={1}>
            <div className="relative overflow-hidden">
              <MediaThumbnail
                media={item}
                className="aspect-square hover:opacity-90 transition-opacity"
                onClick={(e?: React.MouseEvent) => {
                  e?.stopPropagation();
                  handleOpenLightbox(i);
                }}
              />
            </div>
          </AspectRatio>
        ))}

        {media.length > 4 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenLightbox(4);
            }}
            title={`View ${media.length - 4} more media`}
            aria-label={`View ${media.length - 4} more media`}
            className="absolute bottom-2 right-2 bg-background/80 dark:bg-background/60 text-foreground/90 text-xs px-2 py-1 rounded-md hover:bg-background/90 transition-colors"
          >
            +{media.length - 4}
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaGrid;

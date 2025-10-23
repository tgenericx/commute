import React from "react";
import { ResourceType } from "@/graphql/graphql";
import { MediaThumbnailProps } from "./types";
import { cn } from "@/lib/utils";

export const MediaThumbnail: React.FC<MediaThumbnailProps> = ({
  media,
  className,
  rounded = true,
  autoplay = false,
  controls = true,
  onClick,
}: MediaThumbnailProps) => {
  if (!media) return null;

  const radius = rounded ? "rounded-2xl" : "";

  if (media.resourceType === ResourceType.Video) {
    return (
      <video
        src={media.playbackUrl || media.secureUrl}
        controls={controls}
        autoPlay={autoplay}
        loop
        playsInline
        onClick={onClick}
        className={cn("w-full aspect-video", radius, className)}
      />
    );
  }

  return (
    <img
      src={media.secureUrl}
      alt={media.format ?? "Media"}
      loading="lazy"
      onClick={onClick}
      className={cn("w-full h-auto object-cover", radius, className)}
    />
  );
};

export default MediaThumbnail;

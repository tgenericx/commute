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
  const clickable = Boolean(onClick);
  const baseClasses = cn(
    media.resourceType === ResourceType.Video
      ? "w-full aspect-video"
      : "w-full h-auto object-cover",
    radius,
    className,
    clickable && "cursor-pointer",
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  if (media.resourceType === ResourceType.Video) {
    return (
      <video
        src={media.playbackUrl || media.secureUrl}
        controls={controls}
        autoPlay={autoplay}
        muted={autoplay}
        loop
        playsInline
        onClick={
          onClick as React.MouseEventHandler<HTMLVideoElement> | undefined
        }
        onKeyDown={handleKeyDown}
        tabIndex={clickable ? 0 : undefined}
        role={clickable ? "button" : undefined}
        poster={media.secureUrl}
        className={baseClasses}
        {...(media.width ? { width: media.width } : {})}
        {...(media.height ? { height: media.height } : {})}
      />
    );
  }

  return (
    <img
      src={media.secureUrl}
      alt={media.format ?? "Media"}
      loading="lazy"
      decoding="async"
      onClick={onClick as React.MouseEventHandler<HTMLImageElement> | undefined}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? "button" : undefined}
      className={baseClasses}
      {...(media.width ? { width: media.width } : {})}
      {...(media.height ? { height: media.height } : {})}
    />
  );
};

export default MediaThumbnail;

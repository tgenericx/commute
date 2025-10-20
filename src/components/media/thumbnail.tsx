import React from "react";
import { Media, ResourceType } from "@/graphql/graphql";

export type MiniMediaData = Pick<Media, "id" | "secureUrl" | "resourceType">;
type MediaThumbnailProps = MiniMediaData & {
  className?: string;
  onClick?: () => void;
};

const MediaThumbnail: React.FC<MediaThumbnailProps> = ({
  id,
  secureUrl,
  resourceType = ResourceType.Image,
  className = "",
  onClick,
}) => {
  if (!secureUrl) return null;

  if (resourceType === ResourceType.Video) {
    return (
      <video
        id={id}
        src={secureUrl}
        controls
        onClick={onClick}
        className={`rounded-lg w-full object-cover max-h-64 ${className}`}
      />
    );
  }

  return (
    <img
      id={id}
      src={secureUrl}
      alt={resourceType}
      onClick={onClick}
      className={`rounded-lg w-full object-cover max-h-64 ${className}`}
      loading="lazy"
    />
  );
};

export default MediaThumbnail;

import { Media, ResourceType } from "@/graphql/graphql";
import type { AdaptedMedia } from "./types";

export function adaptMedia(media: Media): AdaptedMedia {
  const resourceType = media.resourceType || ResourceType.Image;

  return {
    id: media.id,
    secureUrl: media.secureUrl,
    resourceType,
    width: media.width,
    height: media.height,
    duration: media.duration,
    format: media.format,
    playbackUrl: media.playbackUrl,
  };
}

import { Media, ResourceType } from "@/graphql/graphql";
import type { AdaptedMedia } from "./types";

export function adaptMedia(media: Media): AdaptedMedia {
  const resourceType = media.resourceType || ResourceType.Image;

  return {
    secureUrl: media.secureUrl,
    resourceType,
    width: media.width,
    height: media.height,
    format: media.format,
    playbackUrl: media.playbackUrl,
  };
}

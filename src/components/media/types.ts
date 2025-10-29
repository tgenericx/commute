import type { MouseEvent } from "react";
import { Media } from "@/graphql/graphql";

export type AdaptedMedia = Pick<
  Media,
  "secureUrl" | "resourceType" | "playbackUrl" | "format" | "width" | "height"
>;

/**
 * The thumbnail onClick will be forwarded the mouse event so callers
 * can call event.stopPropagation() if needed. We accept an optional
 * event to make using simple callbacks easier.
 */
export interface MediaThumbnailProps {
  media: AdaptedMedia;
  className?: string;
  rounded?: boolean;
  autoplay?: boolean;
  controls?: boolean;
  onClick?: (event?: MouseEvent<HTMLImageElement | HTMLVideoElement>) => void;
}

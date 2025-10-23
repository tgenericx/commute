import { Media } from "@/graphql/graphql";

export type AdaptedMedia = Pick<Media, "id" | "secureUrl" | "resourceType" | "width" | "height" | "duration" | "format" | "playbackUrl"> & Partial<Media>;

export interface MediaThumbnailProps {
  media: AdaptedMedia;
  className?: string;
  rounded?: boolean;
  autoplay?: boolean;
  controls?: boolean;
  onClick?: () => void;
}

export interface PostMediaGridProps {
  media: MediaItem[];
  maxDisplay?: number;
  onMediaClick?: (index: number) => void;
  onViewAll?: () => void;
  aspectRatio?: string;
  className?: string;
}

export interface MediaItem {
  id: number;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  title: string;
}

export interface MediaThumbnailProps {
  src: string;
  type?: "image" | "video";
  thumbnail?: string;
  alt?: string;
  aspectRatio?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  selectionMode?: boolean;
  className?: string;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  isHovered: boolean;
  isLoading: boolean;
  progress: number;
  duration: number;
  volume: number;
}

export interface LightboxProps {
  media: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export type GridSize = "small" | "medium" | "large";
export type MediaFilter = "all" | "image" | "video";

import React from "react";
import { Play, Image as ImageIcon } from "lucide-react";
import { MediaItem } from "./types";

interface PostMediaGridProps {
  media: MediaItem[];
  maxDisplay?: number;
  onMediaClick?: (index: number) => void;
  onViewAll?: () => void;
  aspectRatio?: string;
  className?: string;
}

export const PostMediaGrid: React.FC<PostMediaGridProps> = ({
  media,
  maxDisplay = 4,
  onMediaClick,
  onViewAll,
  aspectRatio = "16/9",
  className = "",
}) => {
  const displayMedia = media.slice(0, maxDisplay);
  const remainingCount = media.length - maxDisplay;
  const hasMore = remainingCount > 0;

  const getGridClass = () => {
    const count = displayMedia.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    return "grid-cols-2";
  };

  const handleClick = (index: number) => {
    if (hasMore && index === maxDisplay - 1) {
      onViewAll?.();
    } else {
      onMediaClick?.(index);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`grid ${getGridClass()} gap-1 rounded-lg overflow-hidden`}
      >
        {displayMedia.map((item, index) => {
          const isLast = index === displayMedia.length - 1;
          const showOverlay = hasMore && isLast;

          return (
            <div
              key={item.id}
              className="relative cursor-pointer group overflow-hidden bg-slate-800"
              style={{ aspectRatio }}
              onClick={() => handleClick(index)}
            >
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <>
                  <img
                    src={item.thumbnail || item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <Play
                        className="h-5 w-5 text-white ml-0.5"
                        fill="white"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm">
                  {item.type === "image" ? (
                    <ImageIcon className="h-3 w-3 text-white" />
                  ) : (
                    <Play className="h-3 w-3 text-white" />
                  )}
                </div>
              </div>

              {showOverlay && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all group-hover:bg-black/80">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-1">
                      +{remainingCount}
                    </div>
                    <div className="text-sm text-white/90">View all</div>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

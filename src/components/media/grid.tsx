import React, { useState } from "react";
import MediaThumbnail, { MiniMediaData } from "./thumbnail";
import MediaLightbox from "./lightbox";

interface MediaGridProps {
  media: MiniMediaData[];
  className?: string;
}

const MediaGrid: React.FC<MediaGridProps> = ({ media, className = "" }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const gridCols =
    media.length === 1
      ? "grid-cols-1"
      : media.length === 2
        ? "grid-cols-2"
        : "grid-cols-3";

  return (
    <>
      <div className={`grid ${gridCols} gap-2 ${className}`}>
        {media.map((m, i) => (
          <div key={m.id} className="relative overflow-hidden rounded-lg">
            <MediaThumbnail
              id={m.id}
              secureUrl={m.secureUrl}
              resourceType={m.resourceType}
              className="aspect-square hover:opacity-90 transition-opacity"
              onClick={() => setSelectedIndex(i)}
            />
          </div>
        ))}
      </div>

      <MediaLightbox
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        mediaList={media}
        startIndex={selectedIndex ?? 0}
      />
    </>
  );
};

export default MediaGrid;

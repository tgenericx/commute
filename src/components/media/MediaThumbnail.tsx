import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Loader2,
  Check,
  ImageIcon,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { MediaThumbnailProps, VideoPlayerState } from "./types";

export const MediaThumbnail: React.FC<MediaThumbnailProps> = ({
  src,
  type = "image",
  thumbnail,
  alt = "Media",
  aspectRatio = "16/9",
  autoPlay = false,
  showControls = true,
  isSelected = false,
  onSelect,
  selectionMode = false,
  className = "",
}) => {
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    isMuted: true,
    isHovered: false,
    isLoading: true,
    progress: 0,
    duration: 0,
    volume: 100,
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  const updateState = (updates: Partial<VideoPlayerState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    if (type === "video" && videoRef.current && autoPlay) {
      videoRef.current.play().catch(() => {
        updateState({ isPlaying: false });
      });
    }
  }, [autoPlay, type]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (state.isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      updateState({ isPlaying: !state.isPlaying });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !state.isMuted;
      updateState({ isMuted: !state.isMuted });
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
      updateState({
        volume: newVolume,
        isMuted: newVolume === 0,
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const percent =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      updateState({ progress: percent });
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      updateState({
        duration: videoRef.current.duration,
        isLoading: false,
      });
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    if (videoRef.current) {
      videoRef.current.currentTime =
        (newProgress / 100) * videoRef.current.duration;
      updateState({ progress: newProgress });
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (selectionMode && onSelect) {
      e.stopPropagation();
      onSelect();
    } else if (type === "video") {
      togglePlay(e);
    }
  };

  if (type === "image") {
    return (
      <Card
        className={`overflow-hidden border-2 bg-muted group cursor-pointer transition-all ${
          isSelected
            ? "border-primary ring-2 ring-primary ring-offset-2"
            : "border-transparent hover:border-primary/50"
        } ${className}`}
        onMouseEnter={() => updateState({ isHovered: true })}
        onMouseLeave={() => updateState({ isHovered: false })}
        onClick={handleClick}
      >
        <div className="relative" style={{ aspectRatio }}>
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-all duration-500 ${
              state.isHovered ? "scale-110 brightness-75" : "scale-100"
            }`}
            onLoad={() => updateState({ isLoading: false })}
          />
          {state.isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {selectionMode && (
            <div
              className={`absolute top-3 right-3 z-10 transition-all ${
                isSelected
                  ? "scale-100"
                  : state.isHovered
                    ? "scale-100"
                    : "scale-0"
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center ${
                  isSelected
                    ? "bg-primary"
                    : "bg-background/80 backdrop-blur-sm border-2"
                }`}
              >
                {isSelected && (
                  <Check className="h-4 w-4 text-primary-foreground" />
                )}
              </div>
            </div>
          )}
          <div
            className={`absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
              state.isHovered || isSelected ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute bottom-3 left-3 right-3">
              <Badge variant="secondary" className="mb-1 text-xs">
                <ImageIcon className="h-3 w-3 mr-1" />
                Image
              </Badge>
              <p className="text-white text-sm font-medium truncate">{alt}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`overflow-hidden border-2 bg-muted group cursor-pointer transition-all ${
        isSelected
          ? "border-primary ring-2 ring-primary ring-offset-2"
          : "border-transparent hover:border-primary/50"
      } ${className}`}
      onMouseEnter={() => updateState({ isHovered: true })}
      onMouseLeave={() => updateState({ isHovered: false })}
      onClick={handleClick}
    >
      <div className="relative" style={{ aspectRatio }}>
        <video
          ref={videoRef}
          src={src}
          poster={thumbnail}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => updateState({ isPlaying: true })}
          onPause={() => updateState({ isPlaying: false })}
          onEnded={() => updateState({ isPlaying: false })}
          muted={state.isMuted}
          loop
          playsInline
        />

        {state.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        <Badge
          variant="secondary"
          className="absolute top-3 left-3 z-10 backdrop-blur-sm bg-background/80 text-xs"
        >
          <Film className="h-3 w-3 mr-1" />
          {formatTime(state.duration)}
        </Badge>

        {selectionMode && (
          <div
            className={`absolute top-3 right-3 z-10 transition-all ${
              isSelected
                ? "scale-100"
                : state.isHovered
                  ? "scale-100"
                  : "scale-0"
            }`}
          >
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center ${
                isSelected
                  ? "bg-primary"
                  : "bg-background/80 backdrop-blur-sm border-2"
              }`}
            >
              {isSelected && (
                <Check className="h-4 w-4 text-primary-foreground" />
              )}
            </div>
          </div>
        )}

        {!selectionMode && (
          <>
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
                !state.isPlaying || state.isHovered
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            >
              <Button
                onClick={togglePlay}
                size="icon"
                className="h-14 w-14 rounded-full pointer-events-auto hover:scale-110 transition-transform"
                variant="secondary"
              >
                {state.isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
            </div>

            {showControls && (
              <div
                className={`absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
                  state.isHovered || !state.isPlaying
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                <div className="px-3 mb-2">
                  <Slider
                    value={[state.progress]}
                    onValueChange={handleProgressChange}
                    max={100}
                    step={0.1}
                    className="cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between px-3 pb-3">
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={togglePlay}
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-white hover:text-white hover:bg-white/20"
                    >
                      {state.isPlaying ? (
                        <Pause className="h-3.5 w-3.5" />
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                    </Button>

                    <Button
                      onClick={toggleMute}
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-white hover:text-white hover:bg-white/20"
                    >
                      {state.isMuted ? (
                        <VolumeX className="h-3.5 w-3.5" />
                      ) : (
                        <Volume2 className="h-3.5 w-3.5" />
                      )}
                    </Button>

                    <div
                      className="w-16 mx-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Slider
                        value={[state.volume]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="cursor-pointer"
                      />
                    </div>

                    <span className="text-white text-xs font-medium tabular-nums ml-1">
                      {formatTime(videoRef.current?.currentTime || 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

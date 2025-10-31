import React, { useState } from "react";
import { mediaSchema } from "@/lib/validation/media.schema";
import { MediaThumbnail } from "./thumbnail";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Media, ResourceType } from "@/graphql/graphql";

export const MediaPicker: React.FC<{
  onChange?: (files: File[]) => void;
  className?: string;
}> = ({ onChange, className }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const combined = [...files, ...newFiles];

    const parsed = mediaSchema.safeParse(combined);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setFiles(parsed.data);
    onChange?.(parsed.data);

    const newPreviews = parsed.data.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    onChange?.(updatedFiles);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label
        htmlFor="media-upload"
        className="flex items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer hover:bg-muted/20 transition-colors"
      >
        <div className="text-center space-y-2">
          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click or drag media to upload
          </p>
          <p className="text-xs text-muted-foreground">
            (Max 4 files, 50MB each)
          </p>
        </div>
        <input
          id="media-upload"
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleSelect}
        />
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {previews.map((url, index) => {
            const file = files[index];
            const isVideo = file.type.startsWith("video/");
            const thumbnailData = {
              secureUrl: url,
              playbackUrl: isVideo ? url : undefined,
              resourceType: isVideo ? ResourceType.Video : ResourceType.Image,
              format: file.type,
            } as Media;
            return (
              <div key={index} className="relative group">
                <MediaThumbnail
                  media={thumbnailData}
                  className="w-full h-full"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

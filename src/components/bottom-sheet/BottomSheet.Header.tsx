import { X } from "lucide-react";
import { useBottomSheet } from "./BottomSheet";
import { cn } from "@/lib/utils";

interface BottomSheetHeaderProps {
  title?: string;
  showHandle?: boolean;
  showClose?: boolean;
  className?: string;
}

export const BottomSheetHeader = ({
  title,
  showHandle = true,
  showClose = true,
  className,
}: BottomSheetHeaderProps) => {
  const { onClose, controls } = useBottomSheet();

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 border-b border-border relative select-none",
        className
      )}
      onPointerDown={(e) => controls.start(e)}
    >
      {/* Handle bar */}
      {showHandle && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-muted rounded-full" />
      )}

      {/* Title (optional) */}
      {title && (
        <h3 className="text-base font-medium text-center w-full text-foreground">
          {title}
        </h3>
      )}

      {/* Close button */}
      {showClose && (
        <button
          onClick={onClose}
          className="ml-auto p-2 hover:bg-muted/60 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-foreground/70" />
        </button>
      )}
    </div>
  );
};

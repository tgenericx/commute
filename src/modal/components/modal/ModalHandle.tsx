import type { DragBind } from "../../types/modal";
import { cn } from "@/lib/utils";

interface ModalHandleProps {
  visible: boolean;
  dragBind: DragBind;
  className?: string;
}

export const ModalHandle = ({
  visible,
  dragBind,
  className,
}: ModalHandleProps) => {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "flex justify-center py-4 cursor-grab active:cursor-grabbing touch-none",
        className,
      )}
      {...dragBind}
    >
      <div className="w-16 h-1.5 bg-muted-foreground/30 rounded-full transition-all duration-200" />
    </div>
  );
};

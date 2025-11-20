import { cn } from "@/lib/utils";

interface ModalBackdropProps {
  visible: boolean;
  opacity: number;
  duration: number;
  className?: string;
}

export const ModalBackdrop = ({
  visible,
  opacity,
  duration,
  className = "",
}: ModalBackdropProps) => {
  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "absolute inset-0 bg-background/80 backdrop-blur-sm",
        className,
      )}
      style={{
        opacity: visible ? opacity : 0,
        transition: `opacity ${duration}ms ease-out, backdrop-filter ${duration}ms ease-out`,
        pointerEvents: visible ? "auto" : "none",
      }}
    />
  );
};

import { cn } from "@/lib/utils";

interface ModalContainerProps {
  isOpen: boolean;
  dragY: number;
  isAnimating: boolean;
  isDragging: boolean;
  duration: number;
  className?: string;
  size: "small" | "medium" | "large" | "full";
  children: React.ReactNode;
}

export const ModalContainer = ({
  isOpen,
  dragY,
  isAnimating,
  isDragging,
  duration,
  className = "",
  size,
  children,
}: ModalContainerProps) => {
  const sizeClasses = {
    small: "max-h-[40vh] max-w-lg",
    medium: "max-h-[60vh] max-w-2xl",
    large: "max-h-[80vh] max-w-4xl",
    full: "h-screen w-screen rounded-none",
  };

  const getModalTransform = () => {
    if (!isOpen) return "translateY(100%)";
    if (isDragging) return `translateY(${dragY}px)`;
    if (isAnimating) return "translateY(0)";
    return `translateY(${dragY}px)`;
  };

  const modalTransform = getModalTransform();
  const modalOpacity = dragY > 0 ? Math.max(0.3, 1 - dragY / 500) : 1;

  return (
    <div
      className={cn(
        "relative w-full bg-background rounded-t-2xl shadow-lg border flex flex-col transition-transform",
        sizeClasses[size],
        className,
      )}
      style={{
        transform: modalTransform,
        opacity: modalOpacity,
        transition: isDragging
          ? "none"
          : `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
};

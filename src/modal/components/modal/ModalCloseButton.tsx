import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalCloseButtonProps {
  onClick: () => void;
  className?: string;
}

export const ModalCloseButton = ({
  onClick,
  className,
}: ModalCloseButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    className={cn(
      "absolute top-4 right-4 z-10 h-8 w-8 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      className,
    )}
    onClick={onClick}
    aria-label="Close modal"
  >
    <svg
      className="h-4 w-4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  </Button>
);

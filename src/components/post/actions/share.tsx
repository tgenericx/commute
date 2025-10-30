import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseActionProps } from "../types";

export const ShareButton: React.FC<Omit<BaseActionProps, "count">> = ({
  onClick,
  className,
}) => (
  <Button
    onClick={onClick}
    variant="ghost"
    size="sm"
    className={`gap-1 text-sm text-muted-foreground hover:text-primary ${className ?? ""}`}
  >
    <Share2 className="h-4 w-4" />
  </Button>
);

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ShareButton = ({ onClick }) => (
  <Button
    onClick={onClick}
    variant="ghost"
    size="sm"
    className="gap-1 text-sm text-muted-foreground hover:text-primary"
  >
    <Share2 className="h-4 w-4" />
  </Button>
);

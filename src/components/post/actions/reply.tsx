import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ReplyButton = ({ count = 0, onClick }) => (
  <Button
    onClick={onClick}
    variant="ghost"
    size="sm"
    className="gap-1 text-sm text-muted-foreground hover:text-primary"
  >
    <MessageCircle className="h-4 w-4" />
    {count > 0 && <span>{count}</span>}
  </Button>
);

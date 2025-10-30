import { Repeat2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RepostButton = ({ count = 0, onClick }) => (
  <Button
    onClick={onClick}
    variant="ghost"
    size="sm"
    className="gap-1 text-sm text-muted-foreground hover:text-green-500"
  >
    <Repeat2 className="h-4 w-4" />
    {count > 0 && <span>{count}</span>}
  </Button>
);

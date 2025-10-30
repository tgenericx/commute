import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface LikeButtonProps {
  liked?: boolean;
  count?: number;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  liked = false,
  count = 0,
  onClick,
}) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="sm"
      className={`gap-1 text-sm transition-all ${
        liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
      }`}
    >
      <motion.div
        animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
      </motion.div>
      {count > 0 && <span>{count}</span>}
    </Button>
  );
};

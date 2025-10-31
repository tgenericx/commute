import { Button } from "@/components/ui/button";

export const PostFooter = ({
  isSubmitting,
  onCancel,
}: {
  isSubmitting?: boolean;
  onCancel?: () => void;
}) => (
  <div className="flex justify-end gap-3 border-t pt-4 mt-4">
    <Button
      variant="ghost"
      type="button"
      onClick={onCancel}
      disabled={isSubmitting}
    >
      Cancel
    </Button>
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Posting..." : "Post"}
    </Button>
  </div>
);

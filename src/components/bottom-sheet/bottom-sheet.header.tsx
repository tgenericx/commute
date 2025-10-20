import { useBottomSheet } from "@/contexts/bottom-sheet";
import { X } from "lucide-react";

export const BottomSheetHeader = ({
  title,
}: {
  title?: string;
}) => {
  const { onClose } = useBottomSheet();

  return (
    <div className="flex items-center justify-between p-3 border-b border-neutral-800 relative">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-neutral-700 rounded-full" />
      {title && <h2 className="text-lg font-medium text-neutral-200">{title}</h2>}
      <button
        onClick={onClose}
        className="ml-auto p-2 hover:bg-neutral-800 rounded-full"
        aria-label="Close"
      >
        <X className="text-neutral-300 w-5 h-5" />
      </button>
    </div>
  );
};

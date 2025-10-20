export const BottomSheetFooter = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`mt-2 pt-3 border-t border-border flex justify-end gap-2 ${className}`}
  >
    {children}
  </div>
);

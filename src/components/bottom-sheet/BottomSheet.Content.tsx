export const BottomSheetContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`overflow-y-auto flex-1 py-3 ${className}`}>{children}</div>
);

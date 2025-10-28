import React, { createContext, useCallback, useContext, useState } from "react";
import { BottomSheet } from "@/components/bottom-sheet";

export type SheetKey = string;
export type SheetRenderFn = (
  props: any,
  onClose: () => void,
) => React.ReactNode;

interface SheetManagerContextValue {
  openSheet: (key: SheetKey, props?: any) => void;
  closeSheet: () => void;
  registerSheet: (key: SheetKey, render: SheetRenderFn) => void;
}

const SheetManagerContext = createContext<SheetManagerContextValue | null>(
  null,
);

export const SheetManagerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [registry, setRegistry] = useState<Record<SheetKey, SheetRenderFn>>({});
  const [active, setActive] = useState<{ key: SheetKey | null; props?: any }>({
    key: null,
  });

  const registerSheet = useCallback((key: SheetKey, render: SheetRenderFn) => {
    setRegistry((prev) => ({ ...prev, [key]: render }));
  }, []);

  const openSheet = useCallback((key: SheetKey, props?: any) => {
    setActive({ key, props });
  }, []);

  const closeSheet = useCallback(() => {
    setActive({ key: null });
  }, []);

  const Content = active.key ? registry[active.key] : null;

  return (
    <SheetManagerContext.Provider
      value={{ openSheet, closeSheet, registerSheet }}
    >
      {children}
      {Content && (
        <BottomSheet open={!!active.key} onClose={closeSheet}>
          {Content(active.props, closeSheet)}
        </BottomSheet>
      )}
    </SheetManagerContext.Provider>
  );
};

export const useSheetManager = () => {
  const ctx = useContext(SheetManagerContext);
  if (!ctx)
    throw new Error(
      "useSheetManager must be used within <SheetManagerProvider>",
    );
  return ctx;
};

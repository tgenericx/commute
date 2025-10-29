import React, { createContext, useCallback, useContext, useState } from "react";
import { BottomSheet } from "@/components/bottom-sheet";
import type { SheetPropsMap } from "@/types/sheets";

export type SheetKey = keyof SheetPropsMap;

export type SheetRenderFn<K extends SheetKey> = (
  props: SheetPropsMap[K],
  onClose: () => void,
) => React.ReactNode;

interface SheetManagerContextValue {
  openSheet: <K extends SheetKey>(
    key: K,
    ...args: SheetPropsMap[K] extends void ? [] : [props: SheetPropsMap[K]]
  ) => void;
  closeSheet: () => void;
  registerSheet: <K extends SheetKey>(
    key: K,
    ...args: SheetPropsMap[K] extends void
      ? [render: (props: void, onClose: () => void) => React.ReactNode]
      : [
          render: (
            props: SheetPropsMap[K],
            onClose: () => void,
          ) => React.ReactNode,
        ]
  ) => void;
}

const SheetManagerContext = createContext<SheetManagerContextValue | null>(
  null,
);

export const SheetManagerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [registry, setRegistry] = useState<
    Partial<{ [K in SheetKey]: SheetRenderFn<K> }>
  >({});
  const [active, setActive] = useState<{
    key: SheetKey | null;
    props?: SheetPropsMap[SheetKey];
  }>({ key: null });

  const registerSheet = useCallback(
    <K extends SheetKey>(
      key: K,
      ...args: SheetPropsMap[K] extends void
        ? [render: (props: void, onClose: () => void) => React.ReactNode]
        : [
            render: (
              props: SheetPropsMap[K],
              onClose: () => void,
            ) => React.ReactNode,
          ]
    ) => {
      const render = args[0];
      setRegistry((prev) => ({ ...prev, [key]: render }));
    },
    [],
  );

  const openSheet = useCallback(
    <K extends SheetKey>(
      key: K,
      ...args: SheetPropsMap[K] extends void ? [] : [props: SheetPropsMap[K]]
    ) => {
      const props = (args[0] ?? undefined) as SheetPropsMap[K];
      setActive({ key, props });
    },
    [],
  );

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
          {Content(active.props as any, closeSheet)}
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

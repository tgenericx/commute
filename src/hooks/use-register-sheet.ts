import { useEffect, useRef } from "react";
import {
  useSheetManager,
  SheetKey,
  SheetRenderFn,
} from "@/contexts/sheet-manager";
import { SheetProps } from "@/types/sheets";

/**
 * Typed hook to register a sheet with the SheetManager.
 */
export const useRegisterSheet = <K extends SheetKey>(
  key: K,
  render: SheetRenderFn<K>,
): void => {
  const { registerSheet } = useSheetManager();
  const renderRef = useRef(render);

  useEffect(() => {
    renderRef.current = render;
  });

  useEffect(() => {
    registerSheet(key, ((props: SheetProps<K>, onClose: () => void) =>
      renderRef.current(props as any, onClose)) as SheetRenderFn<K>);
  }, [key, registerSheet]);
};

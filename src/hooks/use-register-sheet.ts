import { useEffect, useRef } from "react";
import {
  useSheetManager,
  SheetKey,
  SheetRenderFn,
} from "@/contexts/sheet-manager";

/**
 * Registers a bottom sheet under a specific key with full type safety.
 *
 * Example:
 *   useRegisterSheet("user-preview", (props, onClose) => (
 *     <UserPreview {...props} onClose={onClose} />
 *   ));
 */
export const useRegisterSheet = <K extends SheetKey>(
  key: K,
  render: SheetRenderFn<K>,
) => {
  const { registerSheet } = useSheetManager();
  const renderRef = useRef(render);

  useEffect(() => {
    renderRef.current = render;
  }, [render]);

  useEffect(() => {
    registerSheet(key, (props, onClose) => renderRef.current(props, onClose));
  }, [key, registerSheet]);
};

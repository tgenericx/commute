import { useEffect, useRef } from "react";
import {
  useSheetManager,
  SheetKey,
  SheetRenderFn,
} from "@/contexts/sheet-manager";

export const useRegisterSheet = (key: SheetKey, render: SheetRenderFn) => {
  const { registerSheet } = useSheetManager();
  const renderRef = useRef(render);

  useEffect(() => {
    renderRef.current = render;
  });

  useEffect(() => {
    registerSheet(key, (props, onClose) => renderRef.current(props, onClose));
  }, [key, registerSheet]);
};

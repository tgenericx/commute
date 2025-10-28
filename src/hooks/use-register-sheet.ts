import { useEffect } from "react";
import {
  useSheetManager,
  SheetKey,
  SheetRenderFn,
} from "@/contexts/sheet-manager";

export const useRegisterSheet = (key: SheetKey, render: SheetRenderFn) => {
  const { registerSheet } = useSheetManager();

  useEffect(() => {
    registerSheet(key, render);
  }, [key, render, registerSheet]);
};

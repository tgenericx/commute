import { useCallback } from "react";

type HapticIntensity = "light" | "medium" | "heavy";
type HapticPattern = HapticIntensity | number | number[];

const patterns: Record<HapticIntensity, number | number[]> = {
  light: 10,
  medium: [20, 10],
  heavy: [30, 20, 30],
};

export function useHaptics() {
  const trigger = useCallback((pattern: HapticPattern = "light") => {
    if (typeof navigator === "undefined" || !navigator.vibrate) return;

    if (typeof pattern === "number" || Array.isArray(pattern)) {
      navigator.vibrate(pattern);
      return;
    }

    const preset = patterns[pattern];
    navigator.vibrate(preset);
  }, []);

  return {
    trigger,
    ...Object.fromEntries(
      Object.keys(patterns).map((key) => [key, () => trigger(key as HapticIntensity)])
    ),
  };
}

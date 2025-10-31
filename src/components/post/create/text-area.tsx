import React from "react";
import { Textarea } from "@/components/ui/textarea";

export const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ value, onChange, ...props }, ref) => {
  const innerRef = React.useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = innerRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  };

  React.useEffect(() => resize(), [value]);

  return (
    <Textarea
      {...props}
      value={value ?? ""}
      onChange={(e) => {
        onChange?.(e);
        resize();
      }}
      ref={(el) => {
        innerRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref)
          (ref as React.RefObject<HTMLTextAreaElement | null>).current = el;
      }}
      className="resize-none"
    />
  );
});
AutoResizeTextarea.displayName = "AutoResizeTextarea";

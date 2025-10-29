import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, PenSquare, Calendar, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-provider";
import { motion, AnimatePresence } from "framer-motion";
import { useSheetManager } from "@/contexts/sheet-manager";

const FloatingActionButton = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { openSheet } = useSheetManager();

  const actions = [
    {
      icon: PenSquare,
      label: "Create Post",
      color: "bg-primary text-primary-foreground hover:bg-primary/90",
      onClick: () => {
        setIsOpen(false);
        openSheet("create-post");
      },
    },
    {
      icon: Calendar,
      label: "Create Event",
      color: "bg-accent text-accent-foreground hover:bg-accent/90",
      onClick: () => {
        setIsOpen(false);
        openSheet("create-event");
      },
    },
    {
      icon: Package,
      label: "List Item",
      color: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      onClick: () => {
        setIsOpen(false);
        openSheet("create-listing");
      },
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      // If focus moves outside the container, close the menu
      if (
        containerRef.current &&
        !containerRef.current.contains(e.relatedTarget as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("focusout", handleFocusOut, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("focusout", handleFocusOut, true);
    };
  }, [isOpen]);

  const blurColor =
    theme === "dark"
      ? "backdrop-blur-md bg-black/60"
      : "backdrop-blur-md bg-white/70";

  return (
    <div
      ref={containerRef}
      className="fixed right-6 z-50 flex flex-col-reverse items-end gap-3 bottom-[5.5rem] sm:bottom-10"
    >
      <AnimatePresence>
        {isOpen &&
          actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              <span
                className={cn(
                  "px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-lg border border-border",
                  "bg-card/90 text-foreground/90 backdrop-blur-sm",
                )}
              >
                {action.label}
              </span>
              <Button
                size="icon"
                onClick={action.onClick}
                className={cn(
                  "h-12 w-12 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform duration-150",
                  action.color,
                )}
              >
                <action.icon className="h-5 w-5" />
              </Button>
            </motion.div>
          ))}
      </AnimatePresence>

      <Button
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center",
          "hover:scale-110 active:scale-95",
          blurColor,
          "text-primary-foreground bg-primary",
          isOpen ? "rotate-45" : "rotate-0",
        )}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default FloatingActionButton;

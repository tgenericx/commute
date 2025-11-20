import { Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeaderProps } from "./types";

export const Header = ({ isVisible = true }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 bg-background/95 backdrop-blur-sm border-b ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Buddy</h1>
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </header>
    </div>
  );
};

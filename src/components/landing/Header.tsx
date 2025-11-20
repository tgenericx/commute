import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface HeaderProps {
  onAuthClick: (view: "login" | "register") => void;
}

export const Header = ({ onAuthClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-primary/80 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Buddy</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How it Works
          </a>
          <a
            href="#vision"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Our Story
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="hidden md:inline-flex"
            onClick={() => onAuthClick("login")}
          >
            Sign In
          </Button>
          <Button onClick={() => onAuthClick("register")}>Get Started</Button>
        </div>
      </div>
    </header>
  );
};

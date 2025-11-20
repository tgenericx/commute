import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const titles: Record<string, string> = {
  "/settings": "Settings",
  "/settings/account": "Account",
  "/settings/privacy": "Privacy & Security",
  "/settings/notifications": "Notifications",
  "/settings/appearance": "Appearance",
};

const SettingsLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const title = titles[location.pathname] ?? "Settings";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-lg mx-auto flex h-14 items-center px-4 gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
      </header>

      <main className="w-full max-w-lg mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SettingsLayout;

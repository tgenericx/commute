import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Bell, Lock, User, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();

  const settingsOptions = [
    {
      icon: Palette,
      title: "Appearance",
      description: "Customize theme and display preferences",
      path: "/settings/appearance",
    },
    {
      icon: User,
      title: "Account",
      description: "Manage your account details",
      path: "/settings/account",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Configure notification preferences",
      path: "/settings/notifications",
    },
    {
      icon: Lock,
      title: "Privacy & Security",
      description: "Control your privacy settings",
      path: "/settings/privacy",
    },
  ];

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            {settingsOptions.map((option, index) => (
              <button
                key={option.path}
                onClick={() => navigate(option.path)}
                className={`w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors ${
                  index !== settingsOptions.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <option.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

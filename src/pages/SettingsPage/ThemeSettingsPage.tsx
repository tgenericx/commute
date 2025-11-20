import { ThemeSettings } from "@/components/settings";

export default function ThemeSettingsPage() {

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <p className="text-muted-foreground mt-1">
            Customize how Buddy looks on your device
          </p>
        </div>
        <ThemeSettings />
      </div>
    </div>
  );
}

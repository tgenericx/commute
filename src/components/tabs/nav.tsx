import { usePageContent } from "@/hooks/usePageContent";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsNavProps } from "./types";

export const TabsNav = ({ isVisible = true, activeTab }: TabsNavProps) => {
  const { tabs } = usePageContent();
  const navigate = useNavigate();

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      navigate(tab.path);
    }
  };

  return (
    <nav
      className={`border-t bg-card/95 backdrop-blur-sm fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 safe-area-inset-bottom ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full max-w-lg mx-auto"
      >
        <TabsList className="w-full flex justify-around h-auto bg-transparent border-0 p-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center justify-center gap-1 py-3 px-2 flex-1 rounded-none border-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors"
              >
                <Icon
                  className={`h-5 w-5 transition-all ${
                    isActive ? "scale-110" : "scale-100 opacity-70"
                  }`}
                />
                <span
                  className={`text-xs font-medium transition-all ${
                    isActive ? "opacity-100" : "opacity-60"
                  }`}
                >
                  {tab.label}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </nav>
  );
};

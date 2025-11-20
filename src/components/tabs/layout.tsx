import { Outlet, useLocation } from "react-router-dom";
import { usePageContent } from "@/hooks/usePageContent";
import { useScrollVisibility } from "./useScrollVisibility";
import { Header } from "./header";
import { TabsNav } from "./nav";

export const TabsLayout = () => {
  const { tabs } = usePageContent();
  const location = useLocation();
  const { isHeaderVisible, scrollRef } = useScrollVisibility();

  const activeTab =
    tabs.find((tab) => tab.path === location.pathname)?.id || "home";

  const showBottomNav = !location.pathname.startsWith("/settings");

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header isVisible={isHeaderVisible} />

      <main
        ref={scrollRef}
        className={`flex-1 overflow-auto pt-16 ${showBottomNav ? "pb-16" : ""}`}
      >
        <Outlet />
      </main>

      {showBottomNav && (
        <TabsNav isVisible={isHeaderVisible} activeTab={activeTab} />
      )}
    </div>
  );
};

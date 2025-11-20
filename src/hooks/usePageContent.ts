import { Calendar, ShoppingBag, User, Search, Home } from "lucide-react";
import type { Tab } from "@/types/tabs";

const tabs: Tab[] = [
  { id: "home", label: "Home", icon: Home, path: "/home" },
  { id: "events", label: "Events", icon: Calendar, path: "/events" },
  {
    id: "marketplace",
    label: "Market",
    icon: ShoppingBag,
    path: "/marketplace",
  },
  { id: "discover", label: "Discover", icon: Search, path: "/discover" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
];

export const usePageContent = () => {
  return {
    tabs,
  };
};

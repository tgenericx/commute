import { LucideIcon } from "lucide-react";

export interface Tab {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface HeaderProps {
  isVisible?: boolean;
}

export interface TabsNavProps {
  isVisible?: boolean;
  activeTab: string;
}

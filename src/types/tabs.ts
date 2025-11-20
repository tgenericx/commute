import { type LucideIcon } from "lucide-react";

export interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: LucideIcon;
}

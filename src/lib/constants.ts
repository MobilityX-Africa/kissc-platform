import {
  Users,
  Bike,
  Battery,
  MapPin,
  LayoutDashboard,
  Zap,
  CircuitBoard,
  Box,
  Landmark,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const PLATFORM_NAV_ITEMS: NavItem[] = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Riders", href: "/dashboard/riders", icon: Users },
];

export const OPERATIONS_NAV_ITEMS: NavItem[] = [
  { title: "Bikes", href: "/dashboard/bikes", icon: Bike },
  { title: "Batteries", href: "/dashboard/batteries", icon: Battery },
  { title: "Swap Stations", href: "/dashboard/swap-stations", icon: MapPin },
];

export const SPV_NAV_ITEMS: NavItem[] = [
  { title: "SPV Overview", href: "/dashboard/spv", icon: Landmark },
  { title: "Electric Bikes", href: "/dashboard/spv/bikes", icon: Zap },
  { title: "Batteries", href: "/dashboard/spv/batteries", icon: CircuitBoard },
  { title: "Swap Boxes", href: "/dashboard/spv/swap-boxes", icon: Box },
];

export const APP_NAME = "E-Mobility Asset Management";
export const APP_DESCRIPTION = "MobilityX Africa e-mobility asset management platform";

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  PLATFORM_NAV_ITEMS,
  OPERATIONS_NAV_ITEMS,
  SPV_NAV_ITEMS,
  APP_NAME,
} from "@/lib/constants";
import type { NavItem } from "@/lib/constants";
import { MobilityXLogo } from "@/components/brand/mobilityx-logo";

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
               item.href !== "/dashboard/spv" &&
               pathname.startsWith(item.href));
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <MobilityXLogo size={36} />
          <div className="flex flex-col">
            <span className="text-sm font-bold">{APP_NAME}</span>
            <span className="text-xs text-muted-foreground">
              MobilityX Africa
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Platform" items={PLATFORM_NAV_ITEMS} />
        <NavGroup label="Operations" items={OPERATIONS_NAV_ITEMS} />
        <NavGroup label="SPV Finance" items={SPV_NAV_ITEMS} />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-2 text-xs text-muted-foreground">
          E-Mobility v0.3.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

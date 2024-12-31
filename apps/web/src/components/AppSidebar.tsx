"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import LogoutButton from "./LogoutButton";

import { siteConfig } from "@/config/site";

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const t = useTranslations("sidebar");

  const items = siteConfig.navItems.map((item) => ({
    ...item,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    title: t(item.label as any),
  }));

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton collapsed={!open} />
      </SidebarFooter>
    </Sidebar>
  );
}

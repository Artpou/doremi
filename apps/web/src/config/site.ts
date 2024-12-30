import { Home, User } from "lucide-react";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "DoReMi",
  description: "Discover music, your way.",
  navItems: [
    {
      label: "home",
      href: "/",
      icon: Home,
    },
    {
      label: "profile",
      href: "/profile",
      icon: User,
    },
  ],
};

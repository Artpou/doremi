"use client";

import { Button } from "@workspace/ui/components/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function ButtonLogout({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  const t = useTranslations("common");

  return (
    <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/" })}>
      <LogOut className="size-4" />
      {!collapsed && <span className="truncate">{t("logout")}</span>}
    </Button>
  );
}

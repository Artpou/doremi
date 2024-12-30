"use client";

import { Topbar } from "@workspace/ui/components/topbar";
import { UserPlus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Search } from "./Search";

import favicon from "@/app/favicon.ico";

export function AppTopbar() {
  const router = useRouter();

  return (
    <Topbar>
      <Image
        src={favicon}
        alt="favicon"
        className="size-8 cursor-pointer rounded-sm"
        onClick={() => router.push("/")}
      />
      <Search />
      <Button variant="secondary" size="icon">
        <UserPlus />
      </Button>
    </Topbar>
  );
}

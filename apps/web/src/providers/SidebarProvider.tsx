import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { AppSidebar } from "@/components/AppSidebar";
import { AppTopbar } from "@/components/AppTopbar";
import { auth } from "@/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) return children;

  return (
    <SidebarProvider defaultOpen={false}>
      <AppTopbar />
      <AppSidebar />
      <ScrollArea className="w-full">
        <main className="container mx-auto flex max-h-screen grow flex-col items-center p-4 pt-20">
          <SidebarTrigger />
          {children}
        </main>
      </ScrollArea>
    </SidebarProvider>
  );
}

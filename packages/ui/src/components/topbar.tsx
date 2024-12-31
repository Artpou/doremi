"use client";

import React from "react";
import { cn } from "@workspace/ui/lib/utils";

const Topbar = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={cn("fixed inset-x-0 top-0 z-10 sm:z-[100]", className)}
        ref={ref}
        {...props}
      >
        <div className="flex h-14 items-center justify-center border-b bg-sidebar p-2">
          <div className="relative flex w-full max-w-lg items-center gap-2">
            {children}
          </div>
        </div>
      </div>
    );
  },
);
Topbar.displayName = "Topbar";

export { Topbar };

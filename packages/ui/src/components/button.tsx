"use client";

import { cn } from "../lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

export function Button({
  className,
  isLoading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn("btn p-4 gap-2 items-center", className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <span className="loading loading-spinner w-4" />}
      {children}
    </button>
  );
}

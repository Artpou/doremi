import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "group-[.error]:focus-visible:ring-destructive",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

interface InputWrapperProps extends React.ComponentProps<"div"> {
  label?: string;
  error?: string;
}

const InputWrapper = React.forwardRef<HTMLDivElement, InputWrapperProps>(
  ({ children, label, error, className, ...props }, ref) => (
    <div
      className={cn("flex flex-col gap-1", error && "group error", className)}
      ref={ref}
      {...props}
    >
      {label && <label className="text-sm">{label}</label>}
      {children}
      {error && (
        <span className="text-sm text-destructive animate-in fade-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  ),
);
InputWrapper.displayName = "InputWrapper";

export { Input, InputWrapper };

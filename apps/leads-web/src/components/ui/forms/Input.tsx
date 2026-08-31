import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text",
          "transition-colors duration-200",
          "placeholder:text-muted-light",
          "outline-none",
          "hover:border-border-strong",
          "focus:border-primary",
          "focus:ring-2 focus:ring-primary/15",
          "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
          "aria-[invalid=true]:border-danger",
          "aria-[invalid=true]:focus:border-danger",
          "aria-[invalid=true]:focus:ring-danger/15",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

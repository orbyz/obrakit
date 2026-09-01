import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text",
          "transition-colors duration-200",
          "outline-none",
          "hover:border-border-strong",
          "focus:border-primary",
          "focus:ring-2 focus:ring-primary/15",
          "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
          className,
        )}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";

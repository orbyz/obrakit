import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          `
        w-full
        rounded-xl
        border
        border-border
        bg-surface
        px-3
        py-2.5
        text-sm
        text-text
        focus:outline-none
        focus:ring-2
        focus:ring-primary/20
        `,
          className,
        )}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";

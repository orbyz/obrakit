import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
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
          placeholder:text-muted
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

Input.displayName = "Input";

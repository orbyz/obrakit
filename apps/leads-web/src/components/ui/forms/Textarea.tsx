import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-11 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text",
          "transition-colors duration-200",
          "placeholder:text-muted",
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

Textarea.displayName = "Textarea";

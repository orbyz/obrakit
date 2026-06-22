import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
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

Textarea.displayName = "Textarea";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "danger";

type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants = {
  primary:
    "bg-primary text-secondary hover:bg-primary-hover focus-visible:ring-primary/40",

  secondary:
    "bg-secondary text-white hover:bg-secondary-light focus-visible:ring-secondary/30",

  outline:
    "border border-border bg-surface text-secondary hover:bg-surface-muted focus-visible:ring-primary/30",

  danger:
    "bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger/30",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

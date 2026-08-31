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
    "bg-[#F19A06] text-[#1C2A43] hover:bg-[#D98600] focus-visible:ring-[#F19A06]/40",

  secondary:
    "bg-[#1C2A43] text-white hover:bg-[#263956] focus-visible:ring-[#1C2A43]/30",

  outline:
    "border border-[#E2E8F0] bg-white text-[#1C2A43] hover:bg-[#F1F5F9] focus-visible:ring-[#F19A06]/30",

  danger:
    "bg-[#DC2626] text-white hover:bg-[#DC2626]/90 focus-visible:ring-[#DC2626]/30",
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

import { cn } from "@/lib/utils";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variants = {
  primary: "border border-primary/20 bg-primary/10 text-primary",

  secondary: "border border-secondary/20 bg-secondary/10 text-secondary",

  success: "border border-success/20 bg-success/10 text-success",

  warning: "border border-warning/20 bg-warning/10 text-warning",

  danger: "border border-danger/20 bg-danger/10 text-danger",

  neutral: "border border-border bg-background text-muted",
};

const sizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

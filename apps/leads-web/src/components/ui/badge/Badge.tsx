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
  primary: "bg-primary/10 text-primary border border-primary/20",

  secondary: "bg-accent text-primary border border-accent",

  success: "bg-success/10 text-success border border-success/20",

  warning: "bg-warning/10 text-warning border border-warning/20",

  danger: "bg-danger/10 text-danger border border-danger/20",

  neutral: "bg-background text-muted border border-border",
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
        "inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap transition-colors",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

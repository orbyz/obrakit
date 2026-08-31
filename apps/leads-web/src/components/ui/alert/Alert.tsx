import { cn } from "@/lib/utils";

interface AlertProps {
  children: React.ReactNode;
  variant?: "error" | "success" | "warning" | "info";
  className?: string;
}

const variants = {
  error: "border-danger/20 bg-danger/10 text-danger",

  success: "border-success/20 bg-success/10 text-success",

  warning: "border-warning/20 bg-warning/10 text-warning",

  info: "border-secondary/20 bg-secondary/10 text-secondary",
};

export function Alert({
  children,
  variant = "info",
  className,
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        variants[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}

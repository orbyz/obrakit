import { cn } from "@/lib/utils";

interface AlertProps {
  children: React.ReactNode;
  variant?: "error" | "success" | "warning" | "info";
  className?: string;
}

const variants = {
  error:
    "border-red-200 bg-red-50 text-red-700",

  success:
    "border-green-200 bg-green-50 text-green-700",

  warning:
    "border-yellow-200 bg-yellow-50 text-yellow-700",

  info:
    "border-blue-200 bg-blue-50 text-blue-700",
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
        "rounded-lg border px-4 py-3 text-sm",
        variants[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}

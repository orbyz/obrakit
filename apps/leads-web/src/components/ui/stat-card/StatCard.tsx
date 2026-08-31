import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  variant?: "primary" | "success" | "warning" | "neutral";
}

const variants = {
  primary: {
    icon: "bg-primary/10 text-primary",
    value: "text-primary",
  },
  success: {
    icon: "bg-success/10 text-success",
    value: "text-success",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    value: "text-warning",
  },
  neutral: {
    icon: "bg-background text-muted",
    value: "text-text",
  },
};

export default function StatCard({
  label,
  value,
  subtext,
  icon,
  variant = "primary",
}: StatCardProps) {
  const styles = variants[variant];

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-sm font-medium text-muted">
          {label}
        </p>

        {icon && (
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
          >
            {icon}
          </div>
        )}
      </div>

      <p
        className={`mt-4 text-2xl font-bold tracking-tight sm:text-3xl ${styles.value}`}
      >
        {value}
      </p>

      {subtext && (
        <p className="mt-1.5 text-xs leading-5 text-muted">
          {subtext}
        </p>
      )}
    </div>
  );
}

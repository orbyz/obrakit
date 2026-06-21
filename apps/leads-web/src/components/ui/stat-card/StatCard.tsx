interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "neutral";
}

const variants = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  neutral: "text-muted",
};

export default function StatCard({
  label,
  value,
  subtext,
  icon,
  variant = "primary",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="mb-2 flex items-center gap-2">
        {icon}

        <p className="text-sm font-medium text-muted">{label}</p>
      </div>

      <p className={`text-3xl font-bold ${variants[variant]}`}>{value}</p>

      {subtext && <p className="mt-2 text-xs text-muted">{subtext}</p>}
    </div>
  );
}

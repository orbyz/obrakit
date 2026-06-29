import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface py-12 text-center">
      {icon && <div className="mb-3 flex justify-center text-4xl">{icon}</div>}

      <h3 className="text-base font-semibold text-text">{title}</h3>

      {description && <p className="mt-2 text-sm text-muted">{description}</p>}
    </div>
  );
}

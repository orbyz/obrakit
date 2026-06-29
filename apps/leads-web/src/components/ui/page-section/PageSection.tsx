import { ReactNode } from "react";
import { Card } from "../card/Card";

interface PageSectionProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageSection({
  title,
  description,
  actions,
  children,
  className,
}: PageSectionProps) {
  return (
    <Card className={`p-6 ${className ?? ""}`}>
      {(title || description || actions) && (
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-text">{title}</h2>
            )}

            {description && (
              <p className="mt-1 text-sm text-muted">{description}</p>
            )}
          </div>

          {actions}
        </div>
      )}

      {children}
    </Card>
  );
}

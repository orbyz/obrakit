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
    <Card className={`p-4 sm:p-6 ${className ?? ""}`}>
      {(title || description || actions) && (
        <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {title && (
              <h2 className="text-lg font-semibold tracking-tight text-text sm:text-xl">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-1 text-sm leading-6 text-muted">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">
              {actions}
            </div>
          )}
        </div>
      )}

      {children}
    </Card>
  );
}

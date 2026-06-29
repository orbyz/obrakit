import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  children: ReactNode;
  className?: string;
}

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-center justify-between gap-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

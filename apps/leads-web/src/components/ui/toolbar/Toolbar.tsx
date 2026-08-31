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
        "mb-6 flex w-full flex-col gap-3",
        "sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

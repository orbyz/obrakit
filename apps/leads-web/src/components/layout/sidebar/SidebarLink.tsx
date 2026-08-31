import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  onNavigate?: () => void;
}

export function SidebarLink({
  href,
  label,
  icon,
  disabled = false,
  onNavigate,
}: SidebarLinkProps) {
  const content = (
    <>
      {icon}
      <span>{label}</span>

      {disabled && (
        <Badge
          className="ml-auto"
          size="sm"
          variant="neutral"
        >
          Próximamente
        </Badge>
      )}
    </>
  );

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className="flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-muted opacity-50"
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3",
        "text-muted transition-all duration-200",
        "hover:bg-primary hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-primary/20",
      )}
    >
      {content}
    </Link>
  );
}

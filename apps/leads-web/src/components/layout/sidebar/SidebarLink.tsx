import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

export function SidebarLink({
  href,
  label,
  icon,
  disabled = false,
}: SidebarLinkProps) {
  const content = (
    <>
      {icon}
      <span>{label}</span>
      {disabled && (
        <Badge className="ml-auto" size="sm" variant="neutral">
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
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3",
        "text-muted hover:bg-primary hover:text-white",
        "transition-all duration-200",
      )}
    >
      {content}
    </Link>
  );
}

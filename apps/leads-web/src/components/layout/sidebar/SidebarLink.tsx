import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

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
        className="flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-slate-400 opacity-50"
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-4 py-3",
        "text-slate-300 transition-colors duration-200",
        "hover:bg-secondary-light hover:text-slate-100",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-primary/40",
        isActive &&
          "bg-secondary-light font-medium text-slate-100 before:absolute before:left-0 before:h-6 before:w-1 before:rounded-r-full before:bg-primary",
      )}
    >
      {content}
    </Link>
  );
}

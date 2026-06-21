import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function SidebarLink({ href, label, icon }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3",
        "text-muted hover:bg-primary hover:text-white",
        "transition-all duration-200",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

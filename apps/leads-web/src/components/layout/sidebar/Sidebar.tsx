import { Home, Building2, Package, BarChart3 } from "lucide-react";

import { SidebarLink } from "./SidebarLink";

interface SidebarProps {
  email?: string;
}

export function Sidebar({ email }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-border bg-surface">
      <div className="border-b border-border p-6">
        <h1 className="text-2xl font-bold text-primary">ObraKit</h1>

        <p className="mt-1 text-sm text-muted">Gestión de obras</p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <SidebarLink href="/" label="Dashboard" icon={<Home size={18} />} />

        <SidebarLink
          href="/leads"
          label="Obras"
          icon={<Building2 size={18} />}
        />

        <SidebarLink
          href="/materiales"
          label="Materiales"
          icon={<Package size={18} />}
        />

        <SidebarLink
          href="/rentabilidad"
          label="Rentabilidad"
          icon={<BarChart3 size={18} />}
        />
      </nav>

      <div className="border-t border-border p-4">
        <p className="truncate text-sm text-muted">{email}</p>
      </div>
    </aside>
  );
}

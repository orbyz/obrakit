import {
  BarChart3,
  Building2,
  ClipboardList,
  ContactRound,
  FileText,
  Home,
  Package,
  Receipt,
  Users,
} from "lucide-react";

import { SidebarLink } from "./SidebarLink";

interface SidebarProps {
  email?: string;
}

export function Sidebar({ email }: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="border-b border-border p-6">
        <h1 className="text-2xl font-bold text-primary">ObraKit</h1>

        <p className="mt-1 text-sm text-muted">Gestión de obras</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <section>
          <p className="mb-2 px-4 text-xs font-semibold tracking-wide text-muted">
            🏠 INICIO
          </p>
          <SidebarLink
            href="/dashboard"
            label="Dashboard"
            icon={<Home size={18} />}
          />
        </section>

        <div className="my-4 border-t border-border" />

        <section>
          <p className="mb-2 px-4 text-xs font-semibold tracking-wide text-muted">
            📈 COMERCIAL
          </p>
          <div className="space-y-2">
            <SidebarLink
              href="/leads"
              label="CRM"
              icon={<Users size={18} />}
            />
            <SidebarLink
              href="/presupuestos"
              label="Presupuestos"
              icon={<FileText size={18} />}
              disabled
            />
            <SidebarLink
              href="/seguimientos"
              label="Seguimientos"
              icon={<ClipboardList size={18} />}
              disabled
            />
          </div>
        </section>

        <div className="my-4 border-t border-border" />

        <section>
          <p className="mb-2 px-4 text-xs font-semibold tracking-wide text-muted">
            🏗 PRODUCCIÓN
          </p>
          <div className="space-y-2">
            <SidebarLink
              href="/obras"
              label="Obras"
              icon={<Building2 size={18} />}
            />
            <SidebarLink
              href="/empleados"
              label="Empleados"
              icon={<ContactRound size={18} />}
            />
            <SidebarLink
              href="/materiales"
              label="Materiales"
              icon={<Package size={18} />}
            />
            <SidebarLink
              href="/materiales"
              label="Gastos"
              disabled
              icon={<Receipt size={18} />}
            />
          </div>
        </section>

        <div className="my-4 border-t border-border" />

        <section>
          <p className="mb-2 px-4 text-xs font-semibold tracking-wide text-muted">
            📊 FINANZAS
          </p>
          <SidebarLink
            href="/rentabilidad"
            label="Rentabilidad"
            icon={<BarChart3 size={18} />}
          />
        </section>

        <div className="my-4 border-t border-border" />

        <section>
          <p className="mb-2 px-4 text-xs font-semibold tracking-wide text-muted">
            ⚙ CONFIGURACIÓN
          </p>
          <div className="space-y-2">
            <SidebarLink
              href="/empresa"
              label="Empresa"
              icon={<Building2 size={18} />}
              disabled
            />
            <SidebarLink
              href="/usuarios"
              label="Usuarios"
              icon={<ContactRound size={18} />}
              disabled
            />
          </div>
        </section>
      </nav>

      <div className="border-t border-border p-4">
        <p className="truncate text-sm text-muted">{email}</p>
      </div>
    </aside>
  );
}

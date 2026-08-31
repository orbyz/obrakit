"use client";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building2,
  ClipboardList,
  ContactRound,
  FileText,
  Home,
  Menu,
  Package,
  Receipt,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { SidebarLink } from "./SidebarLink";

interface SidebarProps {
  email?: string;
}

export function Sidebar({ email }: SidebarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeSidebar = () => {
    setOpen(false);
  };

  const navigation = (
    <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
      <section>
        <p className="mb-2 px-4 text-xs font-semibold tracking-wide text-muted">
          🏠 INICIO
        </p>

        <SidebarLink
          href="/dashboard"
          label="Dashboard"
          icon={<Home size={18} />}
          onNavigate={closeSidebar}
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
            onNavigate={closeSidebar}
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
            onNavigate={closeSidebar}
          />

          <SidebarLink
            href="/empleados"
            label="Empleados"
            icon={<ContactRound size={18} />}
            onNavigate={closeSidebar}
          />

          <SidebarLink
            href="/materiales"
            label="Materiales"
            icon={<Package size={18} />}
            onNavigate={closeSidebar}
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
          onNavigate={closeSidebar}
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
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="border-b border-border p-6">
          <h1 className="text-2xl font-bold text-primary">
            ObraKit
          </h1>

          <p className="mt-1 text-sm text-muted">
            Gestión de obras
          </p>
        </div>

        {navigation}

        <div className="border-t border-border p-4">
          <p className="truncate text-sm text-muted">
            {email}
          </p>
        </div>
      </aside>

      {/* Mobile header trigger */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 shadow-sm md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <Menu className="h-5 w-5" />
        </button>

        <span className="text-lg font-bold text-white">
          ObraKit
        </span>

        <div className="w-10" aria-hidden="true" />
      </div>

      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Mobile drawer */}
      <aside
        aria-label="Navegación principal"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col",
          "border-r border-border bg-surface shadow-xl",
          "transition-transform duration-200 ease-out md:hidden",
          "overscroll-contain",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <div>
            <h1 className="text-xl font-bold text-primary">
              ObraKit
            </h1>

            <p className="text-xs text-muted">
              Gestión de obras
            </p>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Cerrar menú"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-background hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {navigation}

        <div className="border-t border-border p-4">
          <p className="truncate text-sm text-muted">
            {email}
          </p>
        </div>
      </aside>
    </>
  );
}

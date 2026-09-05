"use client";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building2,
  ClipboardList,
  ContactRound,
  FileText,
  Home,
  LogOut,
  Menu,
  Package,
  Receipt,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { logoutAction } from "@/app/actions/auth";

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

  const account = (
    <div className="border-t border-white/10 p-4">
      <p className="truncate text-sm text-slate-300">{email}</p>

      <form action={logoutAction} className="mt-3">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-secondary-light hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
          <span>Cerrar sesión</span>
        </button>
      </form>
    </div>
  );

  const navigation = (
    <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
      <section>
        <p className="mb-2 px-4 text-xs font-semibold tracking-wide text-slate-400">
          INICIO
        </p>

        <SidebarLink
          href="/dashboard"
          label="Dashboard"
          icon={<Home size={18} />}
          onNavigate={closeSidebar}
        />
      </section>

      <div className="my-4 border-t border-white/10" />


      <section>
        <p className="mb-2 px-4 text-xs font-semibold tracking-wide text-slate-400">
          PRODUCCIÓN
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

      <div className="my-4 border-t border-white/10" />

      <section>
        <p className="mb-2 px-4 text-xs font-semibold tracking-wide text-slate-400">
          COMERCIAL
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

      <div className="my-4 border-t border-white/10" />

      <section>
        <p className="mb-2 px-4 text-xs font-semibold tracking-wide text-slate-400">
          FINANZAS
        </p>

        <SidebarLink
          href="/rentabilidad"
          label="Rentabilidad"
          icon={<BarChart3 size={18} />}
          onNavigate={closeSidebar}
        />
      </section>

      <div className="my-4 border-t border-white/10" />

      <section>
        <p className="mb-2 px-4 text-xs font-semibold tracking-wide text-slate-400">
          CONFIGURACIÓN
        </p>

        <div className="space-y-2">
          <SidebarLink
            href="/empresa"
            label="Empresa"
            icon={<Building2 size={18} />}
            onNavigate={closeSidebar}
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
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-secondary md:flex">
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <Image
              src="/images/brand/logo.png"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-lg"
            />

            <div>
              <h1 className="text-2xl font-bold leading-tight text-primary">
                ObraKit
              </h1>

              <p className="mt-1 text-sm text-slate-300">
                Gestión de obras
              </p>
            </div>
          </div>
        </div>

        {navigation}

        {account}
      </aside>

      {/* Mobile header trigger */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-secondary px-4 shadow-sm md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-100 transition-colors hover:bg-secondary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <Image
            src="/images/brand/logo.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-lg"
          />
          <div>
            <span className="block text-base font-bold leading-tight text-primary">
              ObraKit
            </span>
            <span className="block text-xs leading-tight text-slate-300">
              Gestión de obras
            </span>
          </div>
        </div>

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
          "border-r border-white/10 bg-secondary shadow-xl",
          "transition-transform duration-200 ease-out md:hidden",
          "overscroll-contain",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/brand/logo.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-lg"
            />
            <div>
              <h1 className="text-lg font-bold leading-tight text-primary">
                ObraKit
              </h1>

              <p className="text-xs leading-tight text-slate-300">
                Gestión de obras
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Cerrar menú"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-secondary-light hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {navigation}

        {account}
      </aside>
    </>
  );
}

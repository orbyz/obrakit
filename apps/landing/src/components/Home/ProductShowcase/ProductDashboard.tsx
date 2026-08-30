import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Package,
  Users,
} from "lucide-react";

const stats = [
  {
    label: "Facturación",
    value: "34.580 €",
    change: "+12,4%",
  },
  {
    label: "Obras activas",
    value: "12",
    change: "+2 este mes",
  },
  {
    label: "Equipo",
    value: "8",
    change: "6 en obra",
  },
  {
    label: "Presupuestos",
    value: "5",
    change: "2 por revisar",
  },
];

const activity = [
  {
    icon: CheckCircle2,
    title: "Presupuesto aprobado",
    description: "Villa Aurora · 12.450 €",
  },
  {
    icon: Package,
    title: "Material solicitado",
    description: "Cocina · 3 artículos",
  },
  {
    icon: Users,
    title: "Equipo asignado",
    description: "Villa Aurora · 4 operarios",
  },
  {
    icon: CircleDollarSign,
    title: "Factura cobrada",
    description: "Factura #1048 · 8.320 €",
  },
];

const projects = [
  {
    name: "Villa Aurora",
    client: "Carlos Martínez",
    progress: 78,
    value: "24.500 €",
  },
  {
    name: "Chalet Norte",
    client: "Laura Gómez",
    progress: 92,
    value: "18.200 €",
  },
  {
    name: "Local Centro",
    client: "Grupo Norte",
    progress: 45,
    value: "31.800 €",
  },
];

export default function ProductDashboard() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
      {/* App header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
            <BriefcaseBusiness className="h-4 w-4 text-white" />
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              ObraKit
            </p>
            <p className="text-sm font-semibold text-slate-900">
              Centro de Mando
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <span className="text-xs text-slate-400">Empresa Demo</span>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
            JM
          </div>
        </div>
      </div>

      {/* Dashboard body */}
      <div className="bg-slate-50/80 p-4 sm:p-7">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400">Resumen general</p>

            <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
              Así marcha tu empresa
            </h3>
          </div>

          <div className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-500 sm:block">
            Últimos 30 días
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <p className="text-[10px] font-medium text-slate-400">
                {stat.label}
              </p>

              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {stat.value}
              </p>

              <p className="mt-1 text-[9px] font-medium text-emerald-600">
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="mt-3 grid gap-3 xl:grid-cols-[1.1fr_.9fr]">
          {/* Activity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  Actividad reciente
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  Lo que está ocurriendo ahora
                </p>
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-300" />
            </div>

            <div className="space-y-4">
              {activity.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <Icon className="h-4 w-4 text-slate-600" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-800">
                        {item.title}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-slate-400">
                        {item.description}
                      </p>
                    </div>

                    <span className="ml-auto text-[9px] text-slate-300">
                      Ahora
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Projects */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  Obras activas
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  Estado de tus proyectos
                </p>
              </div>

              <BriefcaseBusiness className="h-4 w-4 text-slate-300" />
            </div>

            <div className="space-y-5">
              {projects.map((project) => (
                <div key={project.name}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-800">
                        {project.name}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-slate-400">
                        {project.client}
                      </p>
                    </div>

                    <span className="shrink-0 text-[10px] font-semibold text-slate-600">
                      {project.value}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-900"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>

                    <span className="text-[9px] font-medium text-slate-400">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom modules */}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Clientes", Users],
            ["Obras", BriefcaseBusiness],
            ["Materiales", Package],
            ["Finanzas", CircleDollarSign],
          ].map(([label, Icon]) => {
            const ModuleIcon = Icon as typeof Users;

            return (
              <div
                key={label as string}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-3"
              >
                <ModuleIcon className="h-3.5 w-3.5 text-slate-500" />

                <span className="text-[10px] font-medium text-slate-600">
                  {label as string}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

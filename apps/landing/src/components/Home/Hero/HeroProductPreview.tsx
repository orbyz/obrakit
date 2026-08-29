import { CheckCircle2, Clock3, HardHat, ReceiptText } from "lucide-react";

const stats = [
  {
    label: "Ingresos",
    value: "34.580 €",
    trend: "+12,4%",
  },
  {
    label: "Obras activas",
    value: "12",
    trend: "+2",
  },
  {
    label: "Equipo",
    value: "8",
    trend: "Hoy",
  },
  {
    label: "Presupuestos",
    value: "5",
    trend: "Pendientes",
  },
];

const activity = [
  {
    icon: CheckCircle2,
    title: "Presupuesto aprobado",
    detail: "Villa Aurora · 12.450 €",
  },
  {
    icon: HardHat,
    title: "Equipo asignado",
    detail: "4 operarios · Villa Aurora",
  },
  {
    icon: Clock3,
    title: "Material solicitado",
    detail: "Cocina · 3 artículos",
  },
  {
    icon: ReceiptText,
    title: "Factura cobrada",
    detail: "Factura #1048 · 8.320 €",
  },
];

const projects = [
  {
    name: "Villa Aurora",
    progress: 78,
  },
  {
    name: "Chalet Norte",
    progress: 92,
  },
  {
    name: "Local Centro",
    progress: 45,
  },
];

export default function HeroProductPreview() {
  return (
    <div className="relative w-full max-w-[680px]">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white p-3 shadow-2xl">
        <div className="overflow-hidden rounded-2xl bg-slate-50">
          {/* Browser / app header */}
          <div className="flex h-11 items-center justify-between border-b border-slate-200 bg-white px-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            </div>

            <span className="text-[10px] font-medium tracking-wide text-slate-400">
              app.obrakit.com
            </span>

            <div className="h-5 w-5 rounded-full bg-slate-200" />
          </div>

          {/* Dashboard */}
          <div className="p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  ObraKit
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                  Centro de Mando
                </h2>
              </div>

              <div className="rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-medium text-white">
                Hoy
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-200 bg-white p-3"
                >
                  <p className="text-[9px] font-medium text-slate-400">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-base font-semibold tracking-tight text-slate-900">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-[9px] font-medium text-emerald-600">
                    {stat.trend}
                  </p>
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="mt-3 grid gap-3 sm:grid-cols-[1.15fr_.85fr]">
              {/* Activity */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-900">
                    Actividad reciente
                  </p>

                  <span className="text-[9px] font-medium text-slate-400">
                    Ver todo
                  </span>
                </div>

                <div className="space-y-3">
                  {activity.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex items-center gap-2.5"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                          <Icon className="h-3.5 w-3.5 text-slate-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-medium text-slate-800">
                            {item.title}
                          </p>

                          <p className="truncate text-[9px] text-slate-400">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Projects */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-4 text-xs font-semibold text-slate-900">
                  Obras activas
                </p>

                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.name}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="truncate text-[10px] font-medium text-slate-700">
                          {project.name}
                        </span>

                        <span className="text-[9px] font-semibold text-slate-500">
                          {project.progress}%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-slate-900"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification */}
      <div className="absolute -left-5 top-12 hidden w-44 rounded-2xl border border-white/10 bg-white p-3 shadow-xl sm:block">
        <div className="flex items-start gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>

          <div>
            <p className="text-[10px] font-semibold text-slate-900">
              Presupuesto aprobado
            </p>
            <p className="mt-0.5 text-[9px] text-slate-400">
              Villa Aurora · 12.450 €
            </p>
          </div>
        </div>
      </div>

      {/* Floating invoice */}
      <div className="absolute -bottom-5 -right-5 hidden w-40 rounded-2xl border border-white/10 bg-white p-3 shadow-xl sm:block">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-medium text-slate-400">
            Factura cobrada
          </p>

          <ReceiptText className="h-3.5 w-3.5 text-slate-500" />
        </div>

        <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
          8.320 €
        </p>

        <p className="mt-0.5 text-[9px] font-medium text-emerald-600">
          Pago recibido
        </p>
      </div>
    </div>
  );
}

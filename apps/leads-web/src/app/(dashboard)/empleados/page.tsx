import Link from "next/link";

import { getEmployees } from "@/app/actions/employees";
import {
  EmployeeFeedbackProvider,
  EmployeeTable,
  NewEmployeeDialog,
} from "@/components/employees";

type EmployeeStatusFilter = "activo" | "inactivo" | "todos";

interface EmployeesPageProps {
  searchParams: Promise<{ estado?: string; q?: string }>;
}

const statusFilters: Array<{
  value: EmployeeStatusFilter;
  label: string;
}> = [
  { value: "activo", label: "Activos" },
  { value: "inactivo", label: "Inactivos" },
  { value: "todos", label: "Todos" },
];

export default async function EmployeesPage({
  searchParams,
}: EmployeesPageProps) {
  const { estado, q } = await searchParams;
  const statusFilter: EmployeeStatusFilter =
    estado === "inactivo" || estado === "todos" ? estado : "activo";
  const searchQuery = q?.trim().toLowerCase() ?? "";
  const employees = await getEmployees();
  const filteredEmployees = employees.filter((employee) => {
    const matchesStatus =
      statusFilter === "todos" || employee.estado === statusFilter;
    const matchesSearch =
      !searchQuery ||
      [employee.nombre, employee.apellidos, employee.especialidad].some((field) =>
        field?.toLowerCase().includes(searchQuery),
      );

    return matchesStatus && matchesSearch;
  });

  function getFilterHref(filter: EmployeeStatusFilter) {
    const params = new URLSearchParams();

    if (filter !== "activo") params.set("estado", filter);
    if (searchQuery) params.set("q", searchQuery);

    const queryString = params.toString();

    return queryString ? `/empleados?${queryString}` : "/empleados";
  }

  return (
    <EmployeeFeedbackProvider>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Empleados
          </h1>

          <p className="text-muted-foreground">
            Gestiona todos los empleados de tu empresa.
          </p>
        </div>

        <NewEmployeeDialog />
      </div>

      <form className="flex gap-3" method="get">
        {statusFilter !== "activo" && (
          <input type="hidden" name="estado" value={statusFilter} />
        )}

        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar empleados"
          className="w-full rounded-xl border border-border bg-surface px-3 py-2.5"
        />

        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2 text-white"
        >
          Buscar
        </button>
      </form>

      <div className="flex gap-2 border-b border-border">
        {statusFilters.map((filter) => (
          <Link
            key={filter.value}
            href={getFilterHref(filter.value)}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-all ${
              statusFilter === filter.value
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

        <EmployeeTable employees={filteredEmployees} />
      </div>
    </EmployeeFeedbackProvider>
  );
}

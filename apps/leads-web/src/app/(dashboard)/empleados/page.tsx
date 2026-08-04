
import { getEmployees } from "@/app/actions/employees";
import {
  EmployeeFeedbackProvider,
  EmployeeTable,
  NewEmployeeDialog,
} from "@/components/employees";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";
import { PageHeader } from "@/components/ui/page-header/PageHeader";
import { Tabs } from "@/components/ui/tabs/Tabs";
import { Toolbar } from "@/components/ui/toolbar/Toolbar";

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
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <PageHeader
            title="Empleados"
            description="Gestiona todos los empleados de tu empresa."
          />
        </div>

        <Toolbar>
          <form
            className="flex w-full gap-3 sm:w-auto sm:flex-1"
            method="get"
          >
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

          <NewEmployeeDialog />
        </Toolbar>

        <Tabs
          value={statusFilter}
          items={statusFilters.map((filter) => ({
            ...filter,
            href: getFilterHref(filter.value),
          }))}
        />

        <Card>
          {filteredEmployees.length === 0 ? (
            <EmptyState title="No existen empleados." />
          ) : (
            <EmployeeTable employees={filteredEmployees} />
          )}
        </Card>
      </div>
    </EmployeeFeedbackProvider>
  );
}

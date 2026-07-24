import { getEmployees } from "@/app/actions/employees";
import { NewEmployeeDialog } from "@/components/employees";
import { EmployeeTable } from "@/components/employees";

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
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

      <EmployeeTable employees={employees} />
    </div>
  );
}

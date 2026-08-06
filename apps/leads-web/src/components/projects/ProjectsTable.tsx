import { Card } from "@/components/ui/card";
import type { Project } from "@/types";

import { ProjectRow } from "./ProjectRow";

type Props = {
  projects: Project[];
};

export function ProjectsTable({ projects }: Props) {
  return (
    <Card className="overflow-x-auto">
      <table className="min-w-full table-fixed">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-sm font-medium">
            <th className="px-4 py-3 w-[28%]">Obra</th>
            <th className="px-4 py-3 w-[22%]">Cliente</th>
            <th className="px-4 py-3 w-[15%]">Estado</th>
            <th className="px-4 py-3 w-[15%]">Inicio</th>
            <th className="px-4 py-3 w-[12%]">Presupuesto</th>
            <th className="px-4 py-3 w-[8%] text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
            />
          ))}
        </tbody>
      </table>
    </Card>
  );
}

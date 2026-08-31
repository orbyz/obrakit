import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Project } from "@/types";

import { ProjectRow } from "./ProjectRow";

type Props = {
  projects: Project[];
};

export function ProjectsTable({ projects }: Props) {
  return (
    <Card className="overflow-hidden p-0">
      <Table size="md">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[28%]">Obra</TableHead>
            <TableHead className="w-[22%]">Cliente</TableHead>
            <TableHead className="w-[15%]">Estado</TableHead>
            <TableHead className="w-[15%]">Inicio</TableHead>
            <TableHead className="w-[12%]">
              Presupuesto
            </TableHead>
            <TableHead className="w-[8%] text-right">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

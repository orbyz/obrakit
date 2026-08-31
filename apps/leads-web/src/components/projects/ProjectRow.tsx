import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { PROJECT_STATUS } from "@/lib/constants/project-status";
import type { Project } from "@/types";

type Props = {
  project: Project;
};

export function ProjectRow({ project }: Props) {
  const status = PROJECT_STATUS[project.status];

  return (
    <TableRow>
      <TableCell className="font-medium">
        {project.name}
      </TableCell>

      <TableCell>
        {project.client_name || "-"}
      </TableCell>

      <TableCell>
        <Badge variant={status.variant}>
          {status.label}
        </Badge>
      </TableCell>

      <TableCell className="whitespace-nowrap text-muted">
        {project.planned_start_date ?? "-"}
      </TableCell>

      <TableCell className="whitespace-nowrap tabular-nums">
        {project.approved_budget
          ? new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: "EUR",
            }).format(project.approved_budget)
          : "-"}
      </TableCell>

      <TableCell className="text-right">
        <Link
          href={`/obras/${project.id}`}
          className="
            inline-flex h-9 items-center justify-center
            rounded-lg border border-border
            bg-surface px-3
            text-sm font-medium text-primary
            whitespace-nowrap
            transition-colors
            hover:bg-background
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary/20
          "
        >
          Ver
        </Link>
      </TableCell>
    </TableRow>
  );
}

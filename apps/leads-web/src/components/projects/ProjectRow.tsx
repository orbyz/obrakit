import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { PROJECT_STATUS } from "@/lib/constants/project-status";
import type { Project } from "@/types";

type Props = {
  project: Project;
};

export function ProjectRow({ project }: Props) {
  const status = PROJECT_STATUS[project.status];

  return (
    <tr className="border-b hover:bg-slate-100 transition-colors">
      <td className="px-4 py-3 font-medium">{project.name}</td>

      <td className="px-4 py-3">
        {project.client_name || "-"}
      </td>

      <td className="px-4 py-3">
        <Badge variant={status.variant}>
          {status.label}
        </Badge>
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        {project.planned_start_date ?? "-"}
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        {project.approved_budget
          ? new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: "EUR",
            }).format(project.approved_budget)
          : "-"}
      </td>

      <td className="px-4 py-3 text-right">
        <Link
          href={`/obras/${project.id}`}
          className="text-sm text-primary hover:underline whitespace-nowrap"
        >
          Ver
        </Link>
      </td>
    </tr>
  );
}

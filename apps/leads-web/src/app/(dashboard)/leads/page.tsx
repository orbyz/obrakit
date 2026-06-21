import { getLeads } from "@/app/actions/leads";
import KanbanBoard from "@/components/leads/KanbanBoard";
import { PageHeader } from "@/components/ui/page-header/PageHeader";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Mis Obras"
          description="Gestiona tus proyectos de un vistazo"
        />
      </div>

      {/* Kanban */}
      <KanbanBoard leads={leads} />
    </div>
  );
}

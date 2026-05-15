import { getLeads } from "@/app/actions/leads";
import KanbanBoard from "@/components/leads/KanbanBoard";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pipeline de Leads
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona tus obras de un vistazo
          </p>
        </div>
      </div>

      {/* Kanban */}
      <KanbanBoard leads={leads} />
    </div>
  );
}

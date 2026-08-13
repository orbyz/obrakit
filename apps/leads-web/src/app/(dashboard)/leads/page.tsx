import { getCRMOpportunities } from "@/app/actions/leads";
import CRMBoard from "@/components/leads/CRMBoard";
import { PageHeader } from "@/components/ui/page-header/PageHeader";

export default async function LeadsPage() {
  const opportunities = await getCRMOpportunities();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <PageHeader
          title="CRM"
          description="Gestiona tus oportunidades comerciales"
        />
      </div>

      <CRMBoard opportunities={opportunities} />
    </div>
  );
}

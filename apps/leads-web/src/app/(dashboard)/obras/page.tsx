import { getProjects } from "@/app/actions/projects";
import { ProjectsTable, NewProjectDialog } from "@/components/projects";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";
import { PageHeader } from "@/components/ui/page-header/PageHeader";
import { Tabs } from "@/components/ui/tabs/Tabs";
import { Toolbar } from "@/components/ui/toolbar/Toolbar";
import { Input } from "@/components/ui/forms/Input";

type SearchParams = Promise<{
  status?: string;
  search?: string;
}>;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status = "all", search = "" } = await searchParams;

  const projects = await getProjects();

  const projectStatusFilters = [
    { label: "Todas", value: "all" },
    { label: "Planificadas", value: "planned" },
    { label: "En curso", value: "in_progress" },
    { label: "Finalizadas", value: "completed" },
  ] as const;

  const getFilterHref = (value: string) =>
    value === "all"
      ? "/obras"
      : `/obras?status=${value}`;

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      (project.client_name ?? "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      status === "all" || project.status === status;

    return matchesSearch && matchesStatus;
  });

  return (

      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
        <PageHeader
          title="Obras"
          description="Gestiona todas las obras del sistema."
          />
        </div>

        <Toolbar>
          <form
            className="flex w-full gap-3 sm:w-auto sm:flex-1"
            method="get"
          >
            {status !== "activo" && (
              <input type="hidden" name="status" value={status} />
            )}

            <Input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Buscar obras"
            />

            <Button type="submit">
              Buscar
            </Button>
          </form>

          <NewProjectDialog />
        </Toolbar>

        <Tabs
          value={status}
          items={projectStatusFilters.map((filter) => ({
            ...filter,
            href: getFilterHref(filter.value),
          }))}
        />

        <Card>
          {filteredProjects.length === 0 ? (
            <EmptyState title="No existen obras." />
          ) : (
            <ProjectsTable projects={filteredProjects} />
          )}
        </Card>
      </div>

  );
}

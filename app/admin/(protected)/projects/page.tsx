import { AdminFormShell } from "@/components/admin/shared/AdminFormShell";
import { ProjectList } from "@/components/admin/projects/ProjectList";

export default function ProjectsPage() {
  return (
    <AdminFormShell
      label="Admin / Projects"
      title="Projects"
      description="Manage your featured work. Entries are displayed on the public site ordered by Sort Order."
    >
      <ProjectList />
    </AdminFormShell>
  );
}

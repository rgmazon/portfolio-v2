import { AdminFormShell } from "@/components/admin/shared/AdminFormShell";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";

export default function NewProjectPage() {
  return (
    <AdminFormShell
      label="Admin / Projects / New"
      title="New Project"
      description="Add a new project to your portfolio."
    >
      <ProjectForm />
    </AdminFormShell>
  );
}

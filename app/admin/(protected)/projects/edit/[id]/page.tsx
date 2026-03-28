import { AdminFormShell } from "@/components/admin/shared/AdminFormShell";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;

  return (
    <AdminFormShell
      label="Admin / Projects / Edit"
      title="Edit Project"
      description="Update the details for this project."
    >
      <ProjectForm id={id} />
    </AdminFormShell>
  );
}

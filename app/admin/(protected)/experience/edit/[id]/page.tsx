import { AdminFormShell } from "@/components/admin/shared/AdminFormShell";
import { ExperienceForm } from "@/components/admin/experience/ExperienceForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditExperiencePage({ params }: Props) {
  const { id } = await params;

  return (
    <AdminFormShell
      label="Admin / Experience / Edit"
      title="Edit Experience Entry"
      description="Update the details for this role."
    >
      <ExperienceForm id={id} />
    </AdminFormShell>
  );
}

import { AdminFormShell } from "@/components/admin/shared/AdminFormShell";
import { ExperienceForm } from "@/components/admin/experience/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <AdminFormShell
      label="Admin / Experience / New"
      title="New Experience Entry"
      description="Add a new role to your work history."
    >
      <ExperienceForm />
    </AdminFormShell>
  );
}

import { AdminFormShell } from "@/components/admin/shared/AdminFormShell";
import { ExperienceList } from "@/components/admin/experience/ExperienceList";

export default function ExperiencePage() {
  return (
    <AdminFormShell
      label="Admin / Experience"
      title="Experience"
      description="Manage your work history. Entries are displayed on the public site ordered by Sort Order."
    >
      <ExperienceList />
    </AdminFormShell>
  );
}

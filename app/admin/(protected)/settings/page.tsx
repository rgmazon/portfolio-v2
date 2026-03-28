import { AdminFormShell } from "@/components/admin/shared/AdminFormShell";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <AdminFormShell
      label="Admin / Settings"
      title="App Settings"
      description="Manage footer content and toggle section visibility on the public site."
    >
      <SettingsForm />
    </AdminFormShell>
  );
}

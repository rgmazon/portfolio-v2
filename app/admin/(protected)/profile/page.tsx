import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { AdminFormShell } from "@/components/admin/shared/AdminFormShell";
import { ProfileForm } from "@/components/admin/profile/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <AdminFormShell
      label="Admin / Profile"
      title="Account & Profile"
      description="Manage your admin account credentials."
    >
      <ProfileForm email={user.email ?? ""} />
    </AdminFormShell>
  );
}

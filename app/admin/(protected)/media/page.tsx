import { AdminFormShell } from "@/components/admin/shared/AdminFormShell";
import { MediaManager } from "@/components/admin/media/MediaManager";

export default function MediaPage() {
  return (
    <AdminFormShell
      label="Admin / Media"
      title="Media Library"
      description="Upload images and videos to Supabase Storage. Copy the public URL to use in your project media fields."
    >
      <MediaManager />
    </AdminFormShell>
  );
}

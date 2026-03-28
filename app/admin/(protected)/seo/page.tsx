import { AdminFormShell } from "@/components/admin/shared/AdminFormShell";
import { SeoForm } from "@/components/admin/seo/SeoForm";

export default function SeoPage() {
  return (
    <AdminFormShell
      label="Admin / SEO"
      title="SEO & Metadata"
      description="Set the site title, meta description, and Open Graph image used by search engines and social platforms."
    >
      <SeoForm />
    </AdminFormShell>
  );
}

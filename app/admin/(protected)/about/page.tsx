import { AdminFormShell } from "@/components/admin/shared/AdminFormShell";
import { AboutForm } from "@/components/admin/about/AboutForm";

export default function AboutPage() {
  return (
    <AdminFormShell
      label="Admin / About"
      title="About Section"
      description="Edit the bio paragraphs and blockquote shown in the About section."
    >
      <AboutForm />
    </AdminFormShell>
  );
}

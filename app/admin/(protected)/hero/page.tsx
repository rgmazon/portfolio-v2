import { AdminFormShell } from "@/components/admin/shared/AdminFormShell";
import { HeroForm } from "@/components/admin/hero/HeroForm";

export default function HeroPage() {
  return (
    <AdminFormShell
      label="Admin / Hero"
      title="Hero Section"
      description="Edit the headline, CTA buttons, availability badge, socials, and stat strip."
    >
      <HeroForm />
    </AdminFormShell>
  );
}

import { AdminFormShell } from "@/components/admin/shared/AdminFormShell";
import { ContactForm } from "@/components/admin/contact/ContactForm";

export default function ContactPage() {
  return (
    <AdminFormShell
      label="Admin / Contact"
      title="Contact Details"
      description="Edit the email, phone, location, and timezone shown in the Contact section."
    >
      <ContactForm />
    </AdminFormShell>
  );
}

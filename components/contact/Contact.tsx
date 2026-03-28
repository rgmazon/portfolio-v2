import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";
import type { ContactInfo as ContactInfoProps } from "@/lib/db";

type Props = { contact: ContactInfoProps };

export default function Contact({ contact }: Props) {
  return (
    <section id="contact" className="bg-bg py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">

        {/* SECTION LABEL */}
        <span className="block text-[11px] uppercase tracking-widest text-violet mb-4">
          Contact
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <ContactInfo {...contact} />
          <ContactForm />
        </div>

      </div>
    </section>
  );
}
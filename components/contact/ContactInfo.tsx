import { Mail, Phone, MapPin } from "lucide-react";
import type { ContactInfo as ContactInfoProps } from "@/lib/db";

export default function ContactInfo({
  email,
  phone,
  location,
}: ContactInfoProps) {
  return (
    <div className="flex flex-col gap-10">

      {/* HEADLINE */}
      <div className="flex flex-col gap-5">
        <h2 className="font-display font-black uppercase leading-none tracking-tight text-cream text-[clamp(32px,4vw,52px)] m-0">
          Get in{" "}
          <span className="text-muted-dark">Touch.</span>
        </h2>

        <p className="font-body text-[15px] text-muted leading-[1.7] m-0 max-w-sm">
          Have a question or project idea? Fill out the form and I'll
          get back to you within 24 hours.
        </p>
      </div>

      {/* INFO */}
      <div className="flex flex-col">

        {/* EMAIL */}
        <ContactItem
          icon={<Mail size={15} color="var(--violet)" strokeWidth={1.5} />}
          label="Email Us"
          value={email}
          href={`mailto:${email}`}
        />

        {/* PHONE */}
        <ContactItem
          icon={<Phone size={15} color="var(--violet)" strokeWidth={1.5} />}
          label="Call Us"
          value={phone}
          href={`tel:${phone.replace(/\s/g, "")}`}
        />

        {/* LOCATION */}
        <ContactItem
          icon={<MapPin size={15} color="var(--violet)" strokeWidth={1.5} />}
          label="Visit Us"
          value={location}
        />

      </div>
    </div>
  );
}

/* ── ITEM ───────────────────────── */

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const valueClass = "font-body text-sm text-cream-dim";

  return (
    <div className="group flex items-start gap-4 py-5 px-4 lg:px-7 border-b border-border first:border-t transition-colors hover:bg-bg-surface">
      <div className="flex shrink-0 items-center justify-center w-9 h-9 bg-bg-surface">
        {icon}
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-body text-[10px] tracking-wider uppercase text-muted-dark">
          {label}
        </span>

        {href ? (
          <a
            href={href}
            className={`${valueClass} no-underline transition-colors duration-200 hover:text-violet`}
          >
            {value}
          </a>
        ) : (
          <span className={valueClass}>{value}</span>
        )}
      </div>
    </div>
  );
}
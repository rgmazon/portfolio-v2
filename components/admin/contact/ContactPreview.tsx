"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";

interface ContactPreviewProps {
  email: string;
  phone: string;
  location: string;
  timezone: string;
}

interface PreviewRowProps {
  icon: React.ReactNode;
  value: string;
  placeholder: string;
}

function PreviewRow({ icon, value, placeholder }: PreviewRowProps) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
      <span className="text-violet shrink-0">{icon}</span>
      <span className={value ? "text-sm text-cream-dim" : "text-sm text-muted-dark italic"}>
        {value || placeholder}
      </span>
    </div>
  );
}

export function ContactPreview({ email, phone, location, timezone }: ContactPreviewProps) {
  return (
    <div className="bg-bg-darker border border-border px-5 py-4">
      <span className="mb-3 block text-[11px] uppercase tracking-widest text-muted-dark">
        Public Preview
      </span>
      <PreviewRow icon={<Mail size={14} />} value={email} placeholder="email@example.com" />
      <PreviewRow icon={<Phone size={14} />} value={phone} placeholder="+63 900 000 0000" />
      <PreviewRow icon={<MapPin size={14} />} value={location} placeholder="Philippines" />
      <PreviewRow icon={<Clock size={14} />} value={timezone} placeholder="PHT — UTC+8" />
    </div>
  );
}

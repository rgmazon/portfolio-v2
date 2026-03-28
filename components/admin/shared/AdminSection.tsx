import { ReactNode } from "react";

interface AdminSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AdminSection({ title, description, children }: AdminSectionProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 border-b border-border pb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-cream">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-[11px] text-muted">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

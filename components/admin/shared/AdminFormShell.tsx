"use client";

import { ReactNode } from "react";

interface AdminFormShellProps {
  title: string;
  description?: string;
  label?: string;
  children: ReactNode;
}

export function AdminFormShell({
  title,
  description,
  label,
  children,
}: AdminFormShellProps) {
  return (
    <div className="min-h-screen bg-bg px-6 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Page header */}
        <div className="mb-8 border-b border-border pb-6">
          {label && (
            <span className="mb-2 block text-[11px] uppercase tracking-widest text-violet">
              {label}
            </span>
          )}
          <h1 className="text-2xl font-black uppercase tracking-tight text-cream">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted">{description}</p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}

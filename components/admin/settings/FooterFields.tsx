"use client";

import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { AdminField } from "@/components/admin/shared/AdminField";

interface FooterFieldsProps {
  registrations: {
    tagline: UseFormRegisterReturn;
    copyright: UseFormRegisterReturn;
  };
  errors: {
    tagline?: FieldError;
    copyright?: FieldError;
  };
}

export function FooterFields({ registrations, errors }: FooterFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <AdminField
        label="Footer Tagline"
        hint="Short line below the logo in the footer."
        registration={registrations.tagline}
        error={errors.tagline}
        inputProps={{ placeholder: "Designing with intent." }}
      />
      <AdminField
        label="Copyright Text"
        hint="Rendered in the footer bottom bar."
        registration={registrations.copyright}
        error={errors.copyright}
        inputProps={{ placeholder: "© 2025 RG Mazon. All rights reserved." }}
      />
    </div>
  );
}

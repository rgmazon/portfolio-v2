"use client";

import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface StatFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

function StatField({ label, registration, error }: StatFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] uppercase tracking-widest text-muted-dark">
        {label}
      </label>
      <input
        type="number"
        min={0}
        className="w-full bg-bg-darker border border-border text-cream text-sm px-4 py-3 focus:outline-none focus:border-violet transition-colors duration-150 placeholder:text-muted-dark"
        {...registration}
      />
      {error && (
        <span className="text-[12px] text-red-400">{error.message}</span>
      )}
    </div>
  );
}

interface HeroStatsRowProps {
  registrations: {
    years: UseFormRegisterReturn;
    projects: UseFormRegisterReturn;
    clients: UseFormRegisterReturn;
  };
  errors: {
    years?: FieldError;
    projects?: FieldError;
    clients?: FieldError;
  };
}

export function HeroStatsRow({ registrations, errors }: HeroStatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatField
        label="Years Experience"
        registration={registrations.years}
        error={errors.years}
      />
      <StatField
        label="Projects Count"
        registration={registrations.projects}
        error={errors.projects}
      />
      <StatField
        label="Clients Count"
        registration={registrations.clients}
        error={errors.clients}
      />
    </div>
  );
}

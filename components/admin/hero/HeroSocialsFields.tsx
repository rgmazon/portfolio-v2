"use client";

import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { GitBranch, Briefcase, Palette } from "lucide-react";

interface SocialFieldProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

function SocialField({
  icon,
  label,
  placeholder,
  registration,
  error,
}: SocialFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-dark">
        {icon}
        {label}
      </label>
      <input
        type="url"
        placeholder={placeholder}
        className="w-full bg-bg-darker border border-border text-cream text-sm px-4 py-3 focus:outline-none focus:border-violet transition-colors duration-150 placeholder:text-muted-dark"
        {...registration}
      />
      {error && (
        <span className="text-[12px] text-red-400">{error.message}</span>
      )}
    </div>
  );
}

interface HeroSocialsFieldsProps {
  registrations: {
    github: UseFormRegisterReturn;
    linkedin: UseFormRegisterReturn;
    dribbble: UseFormRegisterReturn;
  };
  errors: {
    github?: FieldError;
    linkedin?: FieldError;
    dribbble?: FieldError;
  };
}

export function HeroSocialsFields({
  registrations,
  errors,
}: HeroSocialsFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <SocialField
        icon={<GitBranch size={12} />}
        label="GitHub URL"
        placeholder="https://github.com/username"
        registration={registrations.github}
        error={errors.github}
      />
      <SocialField
        icon={<Briefcase size={12} />}
        label="LinkedIn URL"
        placeholder="https://linkedin.com/in/username"
        registration={registrations.linkedin}
        error={errors.linkedin}
      />
      <SocialField
        icon={<Palette size={12} />}
        label="Dribbble URL"
        placeholder="https://dribbble.com/username"
        registration={registrations.dribbble}
        error={errors.dribbble}
      />
    </div>
  );
}

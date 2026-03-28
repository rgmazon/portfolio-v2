"use client";

import { Control, Controller } from "react-hook-form";
import { SettingsFormValues } from "@/lib/validation/admin-settings";
import { AdminToggle } from "@/components/admin/shared/AdminToggle";

const SECTION_TOGGLES: {
  name: keyof Pick<
    SettingsFormValues,
    "show_hero" | "show_about" | "show_projects" | "show_experience" | "show_contact"
  >;
  label: string;
  description: string;
}[] = [
  {
    name: "show_hero",
    label: "Hero",
    description: "Full-viewport intro with headline, CTA, and availability badge.",
  },
  {
    name: "show_about",
    label: "About",
    description: "Bio paragraphs, blockquote, and highlight cards.",
  },
  {
    name: "show_projects",
    label: "Projects",
    description: "Table of selected work with previews.",
  },
  {
    name: "show_experience",
    label: "Experience",
    description: "Accordion timeline of work history.",
  },
  {
    name: "show_contact",
    label: "Contact",
    description: "Contact info and message form.",
  },
];

interface SectionVisibilityProps {
  control: Control<SettingsFormValues>;
}

export function SectionVisibility({ control }: SectionVisibilityProps) {
  return (
    <div className="flex flex-col gap-2">
      {SECTION_TOGGLES.map(({ name, label, description }) => (
        <Controller
          key={name}
          name={name}
          control={control}
          render={({ field }) => (
            <AdminToggle
              label={label}
              description={description}
              checked={field.value as boolean}
              onChange={field.onChange}
            />
          )}
        />
      ))}
    </div>
  );
}

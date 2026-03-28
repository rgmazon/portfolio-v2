"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import { heroSchema, HeroFormValues } from "@/lib/validation/admin-settings";
import { AdminField } from "@/components/admin/shared/AdminField";
import { AdminSection } from "@/components/admin/shared/AdminSection";
import { AdminSaveBar, SaveStatus } from "@/components/admin/shared/AdminSaveBar";
import { AdminToggle } from "@/components/admin/shared/AdminToggle";
import { HeroStatsRow } from "./HeroStatsRow";
import { HeroSocialsFields } from "./HeroSocialsFields";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PROFILE_FIELDS =
  "id,hero_headline,hero_subtext,hero_cta_primary,hero_cta_secondary,available,github_url,linkedin_url,dribbble_url,years_experience,projects_count,clients_count";

export function HeroForm() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>();
  const [profileId, setProfileId] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      hero_headline: "",
      hero_subtext: "",
      hero_cta_primary: "",
      hero_cta_secondary: "",
      available: false,
      github_url: "",
      linkedin_url: "",
      dribbble_url: "",
      years_experience: 0,
      projects_count: 0,
      clients_count: 0,
    },
  });

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("profile")
        .select(PROFILE_FIELDS)
        .single();
      if (data) {
        setProfileId(data.id);
        reset(data);
      }
    }
    load();
  }, [reset]);

  async function onSubmit(values: HeroFormValues) {
    setStatus("saving");
    setErrorMsg(undefined);

    const { error } = await supabase
      .from("profile")
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq("id", profileId);

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <AdminSection
        title="Content"
        description="Main copy shown in the hero section."
      >
        <AdminField
          label="Headline"
          hint='e.g. "I BUILD THINGS"'
          registration={register("hero_headline")}
          error={errors.hero_headline}
        />
        <AdminField
          label="Subtext"
          textarea
          rows={3}
          registration={register("hero_subtext")}
          error={errors.hero_subtext}
        />
      </AdminSection>

      <AdminSection title="Call to Action" description="Labels for the two hero buttons.">
        <div className="grid grid-cols-2 gap-4">
          <AdminField
            label="Primary CTA"
            hint='e.g. "View Work"'
            registration={register("hero_cta_primary")}
            error={errors.hero_cta_primary}
          />
          <AdminField
            label="Secondary CTA"
            hint='e.g. "Download CV"'
            registration={register("hero_cta_secondary")}
            error={errors.hero_cta_secondary}
          />
        </div>
      </AdminSection>

      <AdminSection title="Availability">
        <Controller
          name="available"
          control={control}
          render={({ field }) => (
            <AdminToggle
              label="Available for Work"
              description="Shows the green availability badge in the hero."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </AdminSection>

      <AdminSection title="Social Links">
        <HeroSocialsFields
          registrations={{
            github: register("github_url"),
            linkedin: register("linkedin_url"),
            dribbble: register("dribbble_url"),
          }}
          errors={{
            github: errors.github_url,
            linkedin: errors.linkedin_url,
            dribbble: errors.dribbble_url,
          }}
        />
      </AdminSection>

      <AdminSection
        title="Stats Strip"
        description="Numbers displayed in the stats row."
      >
        <HeroStatsRow
          registrations={{
            years: register("years_experience", { valueAsNumber: true }),
            projects: register("projects_count", { valueAsNumber: true }),
            clients: register("clients_count", { valueAsNumber: true }),
          }}
          errors={{
            years: errors.years_experience,
            projects: errors.projects_count,
            clients: errors.clients_count,
          }}
        />
      </AdminSection>

      <AdminSaveBar status={status} errorMessage={errorMsg} isFormSubmit />
    </form>
  );
}

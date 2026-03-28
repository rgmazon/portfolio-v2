"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import { settingsSchema, SettingsFormValues } from "@/lib/validation/admin-settings";
import { AdminSection } from "@/components/admin/shared/AdminSection";
import { AdminSaveBar, SaveStatus } from "@/components/admin/shared/AdminSaveBar";
import { SectionVisibility } from "./SectionVisibility";
import { FooterFields } from "./FooterFields";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function SettingsForm() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>();
  const [settingsId, setSettingsId] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      footer_tagline: "",
      footer_copyright: "",
      show_hero: true,
      show_about: true,
      show_projects: true,
      show_experience: true,
      show_contact: true,
    },
  });

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_settings")
        .select(
          "id, footer_tagline, footer_copyright, show_hero, show_about, show_projects, show_experience, show_contact"
        )
        .single();
      if (data) {
        setSettingsId(data.id);
        reset(data);
      }
    }
    load();
  }, [reset]);

  async function onSubmit(values: SettingsFormValues) {
    setStatus("saving");
    setErrorMsg(undefined);

    const { error } = await supabase
      .from("site_settings")
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq("id", settingsId);

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
        title="Footer"
        description="Text content rendered in the site footer."
      >
        <FooterFields
          registrations={{
            tagline: register("footer_tagline"),
            copyright: register("footer_copyright"),
          }}
          errors={{
            tagline: errors.footer_tagline,
            copyright: errors.footer_copyright,
          }}
        />
      </AdminSection>

      <AdminSection
        title="Section Visibility"
        description="Toggle which sections are rendered on the public site."
      >
        <SectionVisibility control={control} />
      </AdminSection>

      <AdminSaveBar status={status} errorMessage={errorMsg} isFormSubmit />
    </form>
  );
}

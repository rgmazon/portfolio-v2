"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import { aboutSchema, AboutFormValues } from "@/lib/validation/admin-settings";
import { AdminField } from "@/components/admin/shared/AdminField";
import { AdminSection } from "@/components/admin/shared/AdminSection";
import { AdminSaveBar, SaveStatus } from "@/components/admin/shared/AdminSaveBar";
import { QuotePreview } from "./QuotePreview";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function AboutForm() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>();
  const [profileId, setProfileId] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      bio_paragraph_1: "",
      bio_paragraph_2: "",
      quote: "",
    },
  });

  const quoteValue = watch("quote");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("profile")
        .select("id, bio_paragraph_1, bio_paragraph_2, quote")
        .single();
      if (data) {
        setProfileId(data.id);
        reset({
          bio_paragraph_1: data.bio_paragraph_1,
          bio_paragraph_2: data.bio_paragraph_2,
          quote: data.quote,
        });
      }
    }
    load();
  }, [reset]);

  async function onSubmit(values: AboutFormValues) {
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
        title="Bio"
        description="Two paragraphs shown in the About section."
      >
        <AdminField
          label="First Paragraph"
          textarea
          rows={4}
          registration={register("bio_paragraph_1")}
          error={errors.bio_paragraph_1}
        />
        <AdminField
          label="Second Paragraph"
          textarea
          rows={4}
          registration={register("bio_paragraph_2")}
          error={errors.bio_paragraph_2}
        />
      </AdminSection>

      <AdminSection
        title="Blockquote"
        description="Displayed as a styled pull quote in the About section."
      >
        <QuotePreview text={quoteValue} />
        <AdminField
          label="Quote Text"
          textarea
          rows={3}
          registration={register("quote")}
          error={errors.quote}
        />
      </AdminSection>

      <AdminSaveBar status={status} errorMessage={errorMsg} isFormSubmit />
    </form>
  );
}

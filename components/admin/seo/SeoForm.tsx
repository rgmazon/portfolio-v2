"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import { seoSchema, SeoFormValues } from "@/lib/validation/admin-settings";
import { AdminField } from "@/components/admin/shared/AdminField";
import { AdminSection } from "@/components/admin/shared/AdminSection";
import { AdminSaveBar, SaveStatus } from "@/components/admin/shared/AdminSaveBar";
import { OgImagePreview } from "./OgImagePreview";
import { CharCount } from "./CharCount";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function SeoForm() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: { seo_title: "", seo_description: "", og_image_url: "" },
  });

  const titleValue = watch("seo_title");
  const descValue = watch("seo_description");
  const ogUrl = watch("og_image_url");

  // Load current values from Supabase
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_settings")
        .select("seo_title, seo_description, og_image_url")
        .single();
      if (data) reset(data);
    }
    load();
  }, [reset]);

  async function onSubmit(values: SeoFormValues) {
    setStatus("saving");
    setErrorMsg(undefined);

    const { error } = await supabase
      .from("site_settings")
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq("id", (await supabase.from("site_settings").select("id").single()).data?.id);

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
        title="Search Engine"
        description="Controls how your site appears in search results."
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-end justify-between">
            <label className="text-[11px] uppercase tracking-widest text-muted-dark">
              Site Title
            </label>
            <CharCount current={titleValue?.length ?? 0} max={70} />
          </div>
          <input
            className="w-full bg-bg-darker border border-border text-cream text-sm px-4 py-3 focus:outline-none focus:border-violet transition-colors duration-150 placeholder:text-muted-dark"
            placeholder="RG Mazon — Developer & Designer"
            {...register("seo_title")}
          />
          {errors.seo_title && (
            <span className="text-[12px] text-red-400">
              {errors.seo_title.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-end justify-between">
            <label className="text-[11px] uppercase tracking-widest text-muted-dark">
              Meta Description
            </label>
            <CharCount current={descValue?.length ?? 0} max={160} />
          </div>
          <textarea
            rows={3}
            className="w-full resize-y bg-bg-darker border border-border text-cream text-sm px-4 py-3 focus:outline-none focus:border-violet transition-colors duration-150 placeholder:text-muted-dark"
            placeholder="A short description for search engines and social shares…"
            {...register("seo_description")}
          />
          {errors.seo_description && (
            <span className="text-[12px] text-red-400">
              {errors.seo_description.message}
            </span>
          )}
        </div>
      </AdminSection>

      <AdminSection
        title="Open Graph Image"
        description="Shown when your site is shared on social media. Upload in /admin/media first, then paste the URL here."
      >
        <OgImagePreview url={ogUrl} />
        <AdminField
          label="OG Image URL"
          hint="Paste the public URL from /admin/media"
          registration={register("og_image_url")}
          error={errors.og_image_url}
        />
      </AdminSection>

      <AdminSaveBar status={status} errorMessage={errorMsg} isFormSubmit />
    </form>
  );
}

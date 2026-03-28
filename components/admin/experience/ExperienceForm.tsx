"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import {
  experienceSchema,
  ExperienceFormValues,
} from "@/lib/validation/admin-settings";
import { AdminField } from "@/components/admin/shared/AdminField";
import { AdminSection } from "@/components/admin/shared/AdminSection";
import { AdminSaveBar, SaveStatus } from "@/components/admin/shared/AdminSaveBar";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  /** Pass an existing experience ID to edit, omit for create */
  id?: string;
};

export function ExperienceForm({ id }: Props) {
  const router = useRouter();
  const isEdit = Boolean(id);

  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      role: "",
      company: "",
      type: "",
      period: "",
      location: "",
      description: "",
      stack: "",
      sort_order: 0,
    },
  });

  // Load existing record when editing
  useEffect(() => {
    if (!id) return;
    async function load() {
      const { data } = await supabase
        .from("experiences")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        reset({
          ...data,
          stack: Array.isArray(data.stack) ? data.stack.join(", ") : data.stack ?? "",
        });
      }
    }
    load();
  }, [id, reset]);

  async function onSubmit(values: ExperienceFormValues) {
    setStatus("saving");
    setErrorMsg(undefined);

    const payload = {
      ...values,
      stack: values.stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      updated_at: new Date().toISOString(),
    };

    let error;

    if (isEdit) {
      ({ error } = await supabase
        .from("experiences")
        .update(payload)
        .eq("id", id));
    } else {
      ({ error } = await supabase.from("experiences").insert(payload));
    }

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("success");
      setTimeout(() => router.push("/admin/experience"), 1000);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <AdminSection title="Role & Company">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminField
            label="Role / Title"
            hint='e.g. "Senior Frontend Developer"'
            registration={register("role")}
            error={errors.role}
          />
          <AdminField
            label="Company"
            hint='e.g. "Acme Studio"'
            registration={register("company")}
            error={errors.company}
          />
        </div>
      </AdminSection>

      <AdminSection title="Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AdminField
            label="Type"
            hint='e.g. "Full-time", "Contract"'
            registration={register("type")}
            error={errors.type}
          />
          <AdminField
            label="Period"
            hint='e.g. "2022 — Present"'
            registration={register("period")}
            error={errors.period}
          />
          <AdminField
            label="Location"
            hint='e.g. "Remote"'
            registration={register("location")}
            error={errors.location}
          />
        </div>
      </AdminSection>

      <AdminSection title="Description">
        <AdminField
          label="Description"
          textarea
          rows={4}
          registration={register("description")}
          error={errors.description}
        />
      </AdminSection>

      <AdminSection
        title="Tech Stack"
        description="Comma-separated list of technologies."
      >
        <AdminField
          label="Stack"
          hint='e.g. "Next.js, TypeScript, Tailwind CSS"'
          registration={register("stack")}
          error={errors.stack}
        />
      </AdminSection>

      <AdminSection
        title="Order"
        description="Lower numbers appear first. Use 0 for the most recent."
      >
        <div className="w-32">
          <AdminField
            label="Sort Order"
            registration={register("sort_order", { valueAsNumber: true })}
            error={errors.sort_order}
            inputProps={{ type: "number", min: 0 }}
          />
        </div>
      </AdminSection>

      <AdminSaveBar status={status} errorMessage={errorMsg} isFormSubmit />
    </form>
  );
}

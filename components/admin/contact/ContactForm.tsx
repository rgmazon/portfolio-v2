"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import { contactSchema, ContactFormValues } from "@/lib/validation/admin-settings";
import { AdminField } from "@/components/admin/shared/AdminField";
import { AdminSection } from "@/components/admin/shared/AdminSection";
import { AdminSaveBar, SaveStatus } from "@/components/admin/shared/AdminSaveBar";
import { ContactPreview } from "./ContactPreview";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function ContactForm() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>();
  const [profileId, setProfileId] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: "", phone: "", location: "", timezone: "" },
  });

  const watched = watch();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("profile")
        .select("id, email, phone, location, timezone")
        .single();
      if (data) {
        setProfileId(data.id);
        reset({
          email: data.email,
          phone: data.phone,
          location: data.location,
          timezone: data.timezone,
        });
      }
    }
    load();
  }, [reset]);

  async function onSubmit(values: ContactFormValues) {
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
        title="Contact Details"
        description="These are displayed in the Contact section of the public site."
      >
        <ContactPreview
          email={watched.email}
          phone={watched.phone}
          location={watched.location}
          timezone={watched.timezone}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminField
            label="Email"
            registration={register("email")}
            error={errors.email}
            inputProps={{ type: "email", placeholder: "you@example.com" }}
          />
          <AdminField
            label="Phone"
            registration={register("phone")}
            error={errors.phone}
            inputProps={{ type: "tel", placeholder: "+63 900 000 0000" }}
          />
          <AdminField
            label="Location"
            registration={register("location")}
            error={errors.location}
            inputProps={{ placeholder: "Philippines" }}
          />
          <AdminField
            label="Timezone"
            registration={register("timezone")}
            error={errors.timezone}
            inputProps={{ placeholder: "PHT — UTC+8" }}
          />
        </div>
      </AdminSection>

      <AdminSaveBar status={status} errorMessage={errorMsg} isFormSubmit />
    </form>
  );
}

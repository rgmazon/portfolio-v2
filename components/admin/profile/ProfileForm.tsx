"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserClient } from "@supabase/ssr";
import { AdminField } from "@/components/admin/shared/AdminField";
import { AdminSection } from "@/components/admin/shared/AdminSection";
import { AdminSaveBar, SaveStatus } from "@/components/admin/shared/AdminSaveBar";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ProfileForm({ email }: { email: string }) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: PasswordFormValues) {
    setStatus("saving");
    setErrorMsg(undefined);

    const { error } = await supabase.auth.updateUser({
      password: values.newPassword,
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("success");
      reset();
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <div>
      <AdminSection
        title="Account"
        description="Your Supabase auth account details."
      >
        <div className="flex items-center gap-3 px-4 py-3 bg-bg-darker border border-border">
          <span className="text-[11px] uppercase tracking-widest text-muted-dark">
            Email
          </span>
          <span className="text-sm text-cream ml-auto">{email}</span>
        </div>
      </AdminSection>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AdminSection
          title="Change Password"
          description="Choose a strong password of at least 8 characters."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminField
              label="New Password"
              registration={register("newPassword")}
              error={errors.newPassword}
              inputProps={{ type: "password", autoComplete: "new-password" }}
            />
            <AdminField
              label="Confirm Password"
              registration={register("confirmPassword")}
              error={errors.confirmPassword}
              inputProps={{ type: "password", autoComplete: "new-password" }}
            />
          </div>
        </AdminSection>

        <AdminSaveBar
          status={status}
          errorMessage={errorMsg}
          isFormSubmit
        />
      </form>
    </div>
  );
}

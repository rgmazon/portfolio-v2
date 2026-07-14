"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormValues } from "@/lib/validation/contact";
import ContactField from "./ContactField";
import ContactSuccess from "./ContactSuccess";

export default function ContactForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || "Something went wrong.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please try again.");
    }
  };

  if (submitted) {
    return (
      <ContactSuccess
        onReset={() => {
          setSubmitted(false);
          reset();
        }}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <ContactField
        label="Full Name"
        placeholder="John Doe"
        registration={register("name")}
        error={errors.name?.message}
      />

      <ContactField
        label="Email"
        type="email"
        placeholder="johndoe@example.com"
        registration={register("email")}
        error={errors.email?.message}
      />

      <ContactField
        label="Message"
        textarea
        placeholder="Your message here..."
        registration={register("message")}
        error={errors.message?.message}
      />

      {/* Honeypot — hidden from humans, harvested by bots. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {serverError && (
        <span className="text-red-400 text-[12px]">{serverError}</span>
      )}

      <button
        type="submit"
        className="btn-fill mt-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
import { z } from "zod";

// ─── SEO ────────────────────────────────────────────────────────────────────

export const seoSchema = z.object({
  seo_title: z.string().min(1, "Title is required").max(70, "Keep under 70 chars"),
  seo_description: z
    .string()
    .min(1, "Description is required")
    .max(160, "Keep under 160 chars"),
  og_image_url: z.string().url("Must be a valid URL").or(z.literal("")),
});

export type SeoFormValues = z.infer<typeof seoSchema>;

// ─── Hero ────────────────────────────────────────────────────────────────────

export const heroSchema = z.object({
  hero_headline: z.string().min(1, "Headline is required"),
  hero_subtext: z.string().min(1, "Subtext is required"),
  hero_cta_primary: z.string().min(1, "Primary CTA label is required"),
  hero_cta_secondary: z.string().min(1, "Secondary CTA label is required"),
  available: z.boolean(),
  github_url: z.string().url("Must be a valid URL").or(z.literal("")),
  linkedin_url: z.string().url("Must be a valid URL").or(z.literal("")),
  dribbble_url: z.string().url("Must be a valid URL").or(z.literal("")),
  years_experience: z.number().int().nonnegative().catch(0),
  projects_count: z.number().int().nonnegative().catch(0),
  clients_count: z.number().int().nonnegative().catch(0),
});

export type HeroFormValues = z.infer<typeof heroSchema>;

// ─── About ───────────────────────────────────────────────────────────────────

export const aboutSchema = z.object({
  bio_paragraph_1: z.string().min(1, "First paragraph is required"),
  bio_paragraph_2: z.string().min(1, "Second paragraph is required"),
  quote: z.string().min(1, "Quote is required"),
});

export type AboutFormValues = z.infer<typeof aboutSchema>;

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  email: z.string().email("Must be a valid email"),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().min(1, "Location is required"),
  timezone: z.string().min(1, "Timezone is required"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

// ─── Experience ──────────────────────────────────────────────────────────────

export const experienceSchema = z.object({
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  type: z.string().min(1, "Type is required"),
  period: z.string().min(1, "Period is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  stack: z.string(), // comma-separated, converted to text[] on save
  sort_order: z.number().int().nonnegative().catch(0),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

// ─── Project ─────────────────────────────────────────────────────────────────

export const projectSchema = z.object({
  num: z.string().min(1, "Number is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  year: z.string().min(1, "Year is required"),
  role: z.string().min(1, "Role is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  stack: z.string(), // comma-separated
  github: z.string().url("Must be a valid URL").or(z.literal("")),
  url: z.string().url("Must be a valid URL").or(z.literal("")),
  sort_order: z.number().int().nonnegative().catch(0),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

// ─── App Settings ─────────────────────────────────────────────────────────────

export const settingsSchema = z.object({
  footer_tagline: z.string().min(1, "Tagline is required"),
  footer_copyright: z.string().min(1, "Copyright text is required"),
  show_hero: z.boolean(),
  show_about: z.boolean(),
  show_projects: z.boolean(),
  show_experience: z.boolean(),
  show_contact: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

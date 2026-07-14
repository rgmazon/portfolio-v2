import { cache } from "react";
import { createClient } from "@/lib/supabase-server";
import { supabasePublic } from "@/lib/supabase-public";
import { heroData } from "@/data/hero";
import { aboutData } from "@/data/about";
import { EXPERIENCES, CAREER_STATS } from "@/data/experience";
import { PROJECTS } from "@/types/projects";
import type { HeroData, Social } from "@/types/hero";
import type { AboutData } from "@/types/about";
import type { Experience, CareerStat } from "@/types/experience";
import type { Project } from "@/types/projects";

// ─── Raw DB row shapes ────────────────────────────────────────────────────────

type ProfileRow = {
  id: string;
  hero_headline: string | null;
  hero_subtext: string | null;
  available: boolean | null;
  github_url: string | null;
  linkedin_url: string | null;
  dribbble_url: string | null;
  years_experience: number | null;
  projects_count: number | null;
  clients_count: number | null;
  bio_paragraph_1: string | null;
  bio_paragraph_2: string | null;
  quote: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  timezone: string | null;
};

type SiteSettingsRow = {
  id: string;
  footer_tagline: string | null;
  footer_copyright: string | null;
  show_hero: boolean | null;
  show_about: boolean | null;
  show_projects: boolean | null;
  show_experience: boolean | null;
  show_contact: boolean | null;
};

// ─── Cached per-request fetchers ─────────────────────────────────────────────

const getProfile = cache(async (): Promise<ProfileRow | null> => {
  const supabase = await createClient();
  const { data } = await supabase.from("profile").select("*").single();
  return data ?? null;
});

const getSettings = cache(async (): Promise<SiteSettingsRow | null> => {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  return data ?? null;
});

// ─── Public data getters ─────────────────────────────────────────────────────

export async function getHeroData(): Promise<HeroData> {
  const profile = await getProfile();
  if (!profile) return heroData;

  const socials = (
    [
      profile.github_url ? { label: "GitHub", href: profile.github_url } : null,
      profile.linkedin_url
        ? { label: "LinkedIn", href: profile.linkedin_url }
        : null,
      profile.dribbble_url
        ? { label: "Dribbble", href: profile.dribbble_url }
        : null,
    ] as (Social | null)[]
  ).filter((s): s is Social => s !== null && Boolean(s.href));

  return {
    badge: profile.available ? "Available for work" : "",
    title: profile.hero_headline ?? heroData.title,
    subtitle: heroData.subtitle,
    description: profile.hero_subtext ?? heroData.description,
    skills: heroData.skills,
    stats: [
      {
        num: `${profile.years_experience ?? 5}+`,
        label: "Years Experience",
      },
      {
        num: `${profile.projects_count ?? 30}+`,
        label: "Projects Shipped",
      },
      {
        num: `${profile.clients_count ?? 12}+`,
        label: "Happy Clients",
      },
      { num: "100%", label: "Remote-Ready" },
    ],
    socials: socials.length > 0 ? socials : heroData.socials,
  };
}

export async function getAboutData(): Promise<AboutData> {
  const profile = await getProfile();
  if (!profile) return aboutData;

  return {
    ...aboutData,
    paragraphs: [
      profile.bio_paragraph_1 ?? aboutData.paragraphs[0],
      profile.bio_paragraph_2 ?? aboutData.paragraphs[1],
    ],
    quote: profile.quote ?? aboutData.quote,
  };
}

export type ContactInfo = {
  email: string;
  phone: string;
  location: string;
  timezone: string;
};

export async function getContactInfo(): Promise<ContactInfo> {
  const profile = await getProfile();
  return {
    email: profile?.email ?? "hello@rgmazon.com",
    phone: profile?.phone ?? "+63 912 345 6789",
    location: profile?.location ?? "Philippines, Remote — UTC+8",
    timezone: profile?.timezone ?? "UTC+8",
  };
}

export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });
  return data && data.length > 0 ? (data as Experience[]) : EXPERIENCES;
}

export async function getCareerStats(): Promise<CareerStat[]> {
  const profile = await getProfile();
  if (!profile) return CAREER_STATS;
  return [
    { num: `${profile.years_experience ?? 5}+`, label: "Years" },
    { num: `${profile.projects_count ?? 30}+`, label: "Projects" },
    { num: `${profile.clients_count ?? 12}+`, label: "Clients" },
  ];
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  return data && data.length > 0 ? (data as Project[]) : PROJECTS;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  // Uses cookieless client — callable from generateStaticParams/generateMetadata.
  const { data } = await supabasePublic
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (data) return data as Project;
  return PROJECTS.find((p) => p.slug === slug) ?? null;
}

export async function getProjectSlugs(): Promise<string[]> {
  // Uses cookieless client — callable from generateStaticParams at build time.
  const { data } = await supabasePublic.from("projects").select("slug");
  if (data && data.length > 0) return data.map((r) => r.slug as string);
  return PROJECTS.map((p) => p.slug);
}

export type FooterData = {
  tagline: string;
  copyright: string;
  email: string;
  socials: Array<{ label: string; href: string }>;
};

export async function getFooterData(): Promise<FooterData> {
  const [settings, profile] = await Promise.all([getSettings(), getProfile()]);

  const socials = (
    [
      profile?.github_url
        ? { label: "GitHub", href: profile.github_url }
        : null,
      profile?.linkedin_url
        ? { label: "LinkedIn", href: profile.linkedin_url }
        : null,
      profile?.dribbble_url
        ? { label: "Dribbble", href: profile.dribbble_url }
        : null,
    ] as ({ label: string; href: string } | null)[]
  ).filter(
    (s): s is { label: string; href: string } => s !== null && Boolean(s?.href)
  );

  return {
    tagline:
      settings?.footer_tagline ??
      "Full-stack developer crafting fast, functional, and brutally honest digital experiences.",
    copyright:
      settings?.footer_copyright ??
      `© ${new Date().getFullYear()} RG Mazon. All rights reserved.`,
    email: profile?.email ?? "hello@rgmazon.com",
    socials:
      socials.length > 0
        ? socials
        : [
            { label: "GitHub", href: "https://github.com/rgmazon" },
            { label: "LinkedIn", href: "https://linkedin.com/in/rgmazon" },
            { label: "Dribbble", href: "https://dribbble.com/rgmazon" },
          ],
  };
}

export type SiteVisibility = {
  show_hero: boolean;
  show_about: boolean;
  show_experience: boolean;
  show_projects: boolean;
  show_contact: boolean;
};

export async function getSiteVisibility(): Promise<SiteVisibility> {
  const settings = await getSettings();
  return {
    show_hero: settings?.show_hero ?? true,
    show_about: settings?.show_about ?? true,
    show_experience: settings?.show_experience ?? true,
    show_projects: settings?.show_projects ?? true,
    show_contact: settings?.show_contact ?? true,
  };
}

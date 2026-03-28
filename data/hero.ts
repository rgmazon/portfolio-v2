// /data/hero.ts
import { HeroData } from "@/types/hero";

export const heroData: HeroData = {
  badge: "Available for work",
  title: "I BUILD THINGS",
  subtitle: "FOR THE WEB.",
  description:
    "Full-stack developer crafting fast, functional, and brutally honest digital experiences. From concept to deployment — no fluff, just code that works.",

  skills: [
    "React.js",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Supabase",
    "PostgreSQL",
    "Figma",
    "UI / UX Design",
    "Vercel",
  ],

  stats: [
    { num: "5+", label: "Years Experience" },
    { num: "30+", label: "Projects Shipped" },
    { num: "12+", label: "Happy Clients" },
    { num: "100%", label: "Remote-Ready" },
  ],

  socials: [
    { label: "GitHub", href: "https://github.com/rgmazon" },
    { label: "LinkedIn", href: "https://linkedin.com/in/rgmazon" },
  ],
};
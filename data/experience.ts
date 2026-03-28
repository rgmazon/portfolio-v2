import { Experience, CareerStat } from "@/types/experience";

export const EXPERIENCES: Experience[] = [
  {
    id: "1",
    role: "Senior Frontend Developer",
    company: "Acme Studio",
    type: "Full-time",
    period: "2022 — Present",
    location: "Remote",
    description: "Led the frontend architecture of a SaaS platform serving 50k+ users...",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
  },
  {
    id: "2",
    role: "Full-Stack Developer",
    company: "Pixel & Co.",
    type: "Full-time",
    period: "2020 — 2022",
    location: "Remote",
    description: "Developed and maintained multiple client-facing web apps...",
    stack: ["React", "Node.js", "PostgreSQL", "Figma"],
  },
  {
    id: "3",
    role: "Frontend Developer",
    company: "Freelance",
    type: "Contract",
    period: "2019 — 2020",
    location: "Remote",
    description: "Delivered bespoke websites and web apps...",
    stack: ["React", "JavaScript", "SCSS", "WordPress"],
  },
  {
    id: "4",
    role: "UI Developer Intern",
    company: "Bright Labs",
    type: "Internship",
    period: "2018 — 2019",
    location: "On-site",
    description: "Built UI components and prototypes...",
    stack: ["HTML", "CSS", "JavaScript", "Figma"],
  },
];

export const CAREER_STATS: CareerStat[] = [
  { num: "5+", label: "Years" },
  { num: "4", label: "Companies" },
  { num: "30+", label: "Projects" },
];
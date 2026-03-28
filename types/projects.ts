export type ProjectMedia = {
  type: "image" | "video";
  src: string;
  poster?: string; // for video thumbnail
};

export type Project = {
  id: string;
  num: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  role: string;
  type: string;
  description: string;
  stack: string[];
  github: string | null;
  url: string | null;
  media: ProjectMedia[];
};

export const PROJECTS: Project[] = [
  {
    id: "1",
    num: "001",
    slug: "arcflow",
    title: "Arcflow",
    category: "SaaS / Dashboard",
    year: "2024",
    role: "Full-Stack Developer",
    type: "Personal Project",
    description:
      "Arcflow is a project management SaaS built for small teams who want clarity without complexity. It features real-time collaboration, a Kanban board, time tracking, and an analytics dashboard — all wrapped in a minimal, fast interface.",
    stack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Zustand"],
    github: "https://github.com/rgmazon",
    url: "https://arcflow.app",
    media: [
      { type: "image", src: "/assets/projects/arcflow-1.jpg" },
      { type: "image", src: "/assets/projects/arcflow-2.jpg" },
      { type: "video", src: "/assets/projects/arcflow-demo.mp4", poster: "/assets/projects/arcflow-1.jpg" },
    ],
  },
  {
    id: "2",
    num: "002",
    slug: "folio-os",
    title: "Folio OS",
    category: "Portfolio / Template",
    year: "2023",
    role: "Designer & Developer",
    type: "Open Source",
    description:
      "A portfolio template system built for developers and designers who want to own their presence online. Ships with a dark/light mode, CMS integration, and a brutalist design system.",
    stack: ["Next.js", "Framer Motion", "Tailwind CSS", "Contentful"],
    github: "https://github.com/rgmazon",
    url: "https://folioos.co",
    media: [
      { type: "image", src: "/assets/projects/folioos-1.jpg" },
      { type: "image", src: "/assets/projects/folioos-2.jpg" },
    ],
  },
  {
    id: "3",
    num: "003",
    slug: "stackr",
    title: "Stackr",
    category: "Developer Tool",
    year: "2023",
    role: "Full-Stack Developer",
    type: "Personal Project",
    description:
      "A developer tool for managing and documenting your personal tech stack. Stackr lets you tag technologies by proficiency, link to relevant projects, and generate a shareable stack page.",
    stack: ["React", "Node.js", "PostgreSQL", "Express"],
    github: "https://github.com/rgmazon",
    url: "https://stackr.dev",
    media: [
      { type: "image", src: "/assets/projects/stackr-1.jpg" },
    ],
  },
  {
    id: "4",
    num: "004",
    slug: "nudge",
    title: "Nudge",
    category: "Mobile / Web App",
    year: "2022",
    role: "Lead Developer",
    type: "Client Project",
    description:
      "A habit-tracking app focused on micro-commitments. Nudge uses gentle reminders and streak mechanics to help users build consistency without pressure. Shipped on iOS, Android, and web.",
    stack: ["React Native", "Supabase", "Expo", "TypeScript"],
    github: null,
    url: "https://nudgeapp.io",
    media: [
      { type: "image", src: "/assets/projects/nudge-1.jpg" },
      { type: "image", src: "/assets/projects/nudge-2.jpg" },
    ],
  },
  {
    id: "5",
    num: "005",
    slug: "brandkit",
    title: "Brandkit",
    category: "Design System",
    year: "2022",
    role: "Designer & Developer",
    type: "Client Project",
    description:
      "A complete design system and component library built for a growing agency. Brandkit covers tokens, typography, spacing, and 40+ components — documented in Storybook and exported as an npm package.",
    stack: ["React", "Storybook", "Figma", "Rollup"],
    github: "https://github.com/rgmazon",
    url: null,
    media: [
      { type: "image", src: "/assets/projects/brandkit-1.jpg" },
    ],
  },
  {
    id: "6",
    num: "006",
    slug: "lumen-cms",
    title: "Lumen CMS",
    category: "CMS / Backend",
    year: "2021",
    role: "Backend Developer",
    type: "Personal Project",
    description:
      "A lightweight headless CMS built on Node.js with a REST API, role-based access control, and a simple admin UI. Designed to be self-hostable and easy to extend.",
    stack: ["Node.js", "PostgreSQL", "Express", "REST API"],
    github: "https://github.com/rgmazon",
    url: "https://lumencms.io",
    media: [
      { type: "image", src: "/assets/projects/lumencms-1.jpg" },
    ],
  },
  {
    id: "7",
    num: "007",
    slug: "qwick",
    title: "Qwick",
    category: "E-commerce",
    year: "2021",
    role: "Full-Stack Developer",
    type: "Client Project",
    description:
      "A fast, minimal e-commerce storefront built for a fashion brand. Qwick handles product listings, cart, checkout via Stripe, and content management via Sanity — deployed on Vercel.",
    stack: ["Next.js", "Stripe", "Sanity", "Tailwind CSS"],
    github: null,
    url: "https://qwick.store",
    media: [
      { type: "image", src: "/assets/projects/qwick-1.jpg" },
      { type: "image", src: "/assets/projects/qwick-2.jpg" },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
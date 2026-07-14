# File Structure

```
portfolio-rgmazon/
├── app/                                       # Next.js App Router
│   ├── (main)/                                # Route group for public site (Navbar + Footer)
│   │   ├── layout.tsx                         # Public layout: fetches footer data, renders Navbar + Footer + ChatBot
│   │   ├── page.tsx                           # Home: parallel fetch of hero/about/experience/projects/contact/visibility
│   │   └── projects/
│   │       └── [slug]/
│   │           └── page.tsx                   # Server component: generateStaticParams + generateMetadata + ISR
│   │
│   ├── admin/
│   │   ├── layout.tsx                         # Pass-through (so /admin/login skips the auth shell)
│   │   ├── login/
│   │   │   └── page.tsx                       # Supabase email/password login
│   │   └── (protected)/                       # Route group — everything here requires an authenticated session
│   │       ├── layout.tsx                     # Auth guard → renders <AdminShell>
│   │       ├── page.tsx                       # Admin dashboard
│   │       ├── about/page.tsx                 # About-section editor
│   │       ├── contact/page.tsx               # Contact-section editor
│   │       ├── experience/
│   │       │   ├── page.tsx                   # List
│   │       │   ├── new/page.tsx               # Create
│   │       │   └── edit/[id]/page.tsx         # Edit
│   │       ├── hero/page.tsx                  # Hero editor
│   │       ├── media/page.tsx                 # Storage bucket manager
│   │       ├── profile/page.tsx               # Profile settings + password change
│   │       ├── projects/
│   │       │   ├── page.tsx                   # List
│   │       │   ├── new/page.tsx               # Create
│   │       │   └── edit/[id]/page.tsx         # Edit
│   │       ├── seo/page.tsx                   # SEO / OG editor
│   │       └── settings/page.tsx              # Site settings (footer + section visibility)
│   │
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts                       # POST — Groq-backed chatbot (streamed)
│   │   └── contact/
│   │       └── route.ts                       # POST — Resend email; Zod-validated, HTML-escaped, honeypot
│   │
│   ├── favicon.ico
│   ├── globals.css                            # Tailwind v4 @theme tokens, :root vars, utility layers, keyframes
│   └── layout.tsx                             # Root layout: fonts only (Onest + Manrope)
│
├── components/
│   ├── about/                                 # About.tsx, AboutContent, AboutHeader, AboutQuote, HighlightCard, HighlightGrid
│   ├── admin/
│   │   ├── AdminShell.tsx                     # Client: collapsible sidebar shell
│   │   ├── AdminSidebar.tsx                   # Sidebar UI
│   │   ├── about/                             # AboutForm, QuotePreview
│   │   ├── contact/                           # ContactForm, ContactPreview
│   │   ├── experience/                        # ExperienceForm, ExperienceList
│   │   ├── hero/                              # HeroForm, HeroSocialsFields, HeroStatsRow
│   │   ├── media/                             # MediaManager (Supabase Storage)
│   │   ├── profile/                           # ProfileForm
│   │   ├── projects/                          # ProjectForm, ProjectList
│   │   ├── seo/                               # SeoForm, CharCount, OgImagePreview
│   │   ├── settings/                          # SettingsForm, FooterFields, SectionVisibility
│   │   └── shared/                            # AdminField, AdminFormShell, AdminSaveBar, AdminSection, AdminToggle
│   ├── chat/
│   │   └── ChatBot.tsx                        # Public chat widget (streams /api/chat)
│   ├── contact/                               # Contact, ContactForm, ContactField, ContactInfo, ContactSuccess
│   ├── experience/                            # Experience, ExperienceHeader, ExperienceItem, ExperienceStats
│   ├── hero/                                  # Hero, HeroActions, HeroBadge, HeroDescription, HeroHeading, HeroSocials, Marquee, Stats
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── footer/                            # Footer, FooterBrand, FooterLinks, FooterBottom
│   └── projects/
│       ├── Projects.tsx                       # Home section; client (cursor tracking)
│       ├── ProjectDetail.tsx                  # Client wrapper for /projects/[slug] (lightbox, keyboard, scroll lock)
│       ├── ProjectRow.tsx
│       ├── ProjectsCursorPreview.tsx
│       ├── ProjectsHeader.tsx
│       └── ProjectsTableHeader.tsx
│
├── data/                                      # Static fallback content (used when Supabase rows are missing)
│   ├── about.ts                               # aboutData
│   ├── experience.ts                          # EXPERIENCES, CAREER_STATS
│   ├── footer.ts                              # NAV_LINKS, SOCIAL_LINKS
│   └── hero.ts                                # heroData
│
├── hooks/
│   └── useIsMobile.ts                         # window.innerWidth < 768 (used by Projects + ProjectDetail)
│
├── lib/
│   ├── db.ts                                  # Public data getters (Supabase reads with local fallbacks)
│   ├── supabase-middleware.ts                 # updateSession helper for proxy.ts
│   ├── supabase-public.ts                     # Cookieless read-only client (build-time / generateStaticParams)
│   ├── supabase-server.ts                     # Request-scoped server client (server components, route handlers)
│   ├── supabase.ts                            # Browser client (admin login, sign-out)
│   └── validation/
│       ├── admin-settings.ts                  # Zod schemas for admin forms
│       └── contact.ts                         # contactSchema (name, email, message, optional website honeypot)
│
├── public/                                    # Static SVGs (file, globe, next, vercel, window)
│
├── supabase/
│   └── schema.sql                             # Tables, RLS policies, storage bucket, seed data
│
├── types/                                     # Global TypeScript types (one domain per file)
│   ├── about.ts
│   ├── contact.ts                             # SOCIALS, INFO arrays used by ContactInfo
│   ├── experience.ts
│   ├── hero.ts
│   ├── index.ts                               # empty; do not re-export from here
│   └── projects.ts                            # Project, ProjectMedia, PROJECTS fallback, getProjectBySlug helper
│
├── .env.local                                 # Env vars (git-ignored)
├── .gitignore
├── AGENTS.md                                  # AI-assistant instructions (points to Next 16 docs)
├── CLAUDE.md                                  # Imports AGENTS.md
├── PROJECT_CONTEXT.md                         # Architecture & conventions (authoritative)
├── README.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts                             # Security headers (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)
├── package.json
├── plan.md                                    # Optimization / security / design plan
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── proxy.ts                                   # Replaces middleware.ts — auth guard for /admin/*
└── tsconfig.json
```

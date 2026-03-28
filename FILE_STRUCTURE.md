# File Structure

```
portfolio-rgmazon/
├── app/                              # Next.js App Router
│   ├── admin/                        # Admin panel routes
│   │   ├── experience/
│   │   │   ├── edit/[id]/            # Edit experience entry
│   │   │   └── new/                  # New experience entry
│   │   ├── login/                    # Admin login
│   │   ├── media/                    # Media management
│   │   ├── profile/                  # Profile settings
│   │   ├── projects/
│   │   │   ├── edit/[id]/            # Edit project
│   │   │   └── new/                  # New project
│   │   └── settings/                 # Admin settings
│   ├── api/
│   │   └── contact/
│   │       └── route.ts              # Contact form API endpoint
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx              # Dynamic project detail page
│   ├── favicon.ico
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
│
├── components/                       # React components
│   ├── about/
│   │   ├── About.tsx
│   │   ├── AboutContent.tsx
│   │   ├── AboutHeader.tsx
│   │   ├── AboutQuote.tsx
│   │   ├── HighlightCard.tsx
│   │   └── HighlightGrid.tsx
│   ├── admin/                        # Admin panel UI components
│   ├── contact/
│   │   ├── Contact.tsx
│   │   ├── ContactForm.tsx
│   │   ├── ContactSuccess.tsx
│   │   └── FormField.tsx
│   ├── experience/
│   │   ├── Experience.tsx
│   │   ├── ExperienceHeader.tsx
│   │   ├── ExperienceItem.tsx
│   │   └── ExperienceStats.tsx
│   ├── hero/
│   │   ├── Hero.tsx
│   │   ├── HeroActions.tsx
│   │   ├── HeroBadge.tsx
│   │   ├── HeroDescription.tsx
│   │   ├── HeroHeading.tsx
│   │   ├── HeroSocials.tsx
│   │   ├── Marquee.tsx
│   │   └── Stats.tsx
│   ├── layout/                       # Shared layout components
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   └── projects/
│       ├── ProjectRow.tsx
│       ├── Projects.tsx
│       ├── ProjectsCursorPreview.tsx
│       ├── ProjectsHeader.tsx
│       └── ProjectsTableHeader.tsx
│
├── data/                             # Static content / seed data
│   ├── about.ts
│   ├── experience.ts
│   └── hero.ts
│
├── hooks/
│   └── useIsMobile.ts                # Mobile breakpoint hook
│
├── lib/                              # Utilities and server-side helpers
│   ├── supabase-middleware.ts        # Supabase middleware client
│   ├── supabase-server.ts            # Supabase server client
│   ├── supabase.ts                   # Supabase browser client
│   └── validation/
│       └── contact.ts                # Zod schema for contact form
│
├── public/                           # Static assets
│
├── types/                            # Global TypeScript types
│   ├── about.ts
│   ├── experience.ts
│   ├── hero.ts
│   ├── index.ts
│   └── projects.ts
│
├── .env.local                        # Environment variables (git-ignored)
├── .gitignore
├── AGENTS.md                         # Agent/AI assistant instructions
├── CLAUDE.md
├── eslint.config.mjs
├── middleware.ts                     # Auth guard for /admin/* routes
├── next-env.d.ts
├── next.config.ts
├── package.json
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

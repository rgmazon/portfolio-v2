# Project Context — portfolio-rgmazon

> Everything an AI assistant needs to know to continue working on this project consistently.

---

## 1. Tech Stack

| Layer           | Tool / Version                                                                |
| --------------- | ----------------------------------------------------------------------------- |
| Framework       | Next.js **16.2.1** (App Router)                                               |
| Language        | TypeScript 5 (strict mode)                                                    |
| Runtime         | React 19.2.4                                                                  |
| Styling         | Tailwind CSS **v4** + custom `@theme` tokens                                  |
| Package manager | **pnpm**                                                                      |
| Database / Auth | Supabase (`@supabase/ssr`, `@supabase/supabase-js`)                           |
| Email           | Resend (`resend`)                                                             |
| Forms           | react-hook-form + Zod + `@hookform/resolvers`                                 |
| Icons           | lucide-react                                                                  |
| Fonts           | Google Fonts via `next/font/google`: **Onest** (display) + **Manrope** (body) |

---

## 2. App Router Layout

```
app/
  layout.tsx              ← Root layout: loads fonts only (no Navbar/Footer)
  globals.css             ← All styles: @theme tokens, :root CSS vars, @layer base/utilities
  (main)/
    layout.tsx            ← Renders <Navbar /> + <Footer /> for public pages
    page.tsx              ← Home: Hero → About → Experience → Projects → Contact
    projects/
      [slug]/page.tsx     ← Dynamic project detail (client component)
  api/
    contact/route.ts      ← POST endpoint; uses Resend for email delivery
  admin/
    layout.tsx            ← Minimal pass-through (no auth, no sidebar)
    login/page.tsx        ← Public login page (no auth check)
    (protected)/
      layout.tsx          ← Auth guard → renders <AdminShell> (sidebar + main)
      page.tsx            ← Admin dashboard
      experience/         ← Experience CRUD
      projects/           ← Projects CRUD
      media/              ← Media manager
      profile/            ← Profile settings
      settings/           ← App settings
```

**Route group rationale:**

- `(main)` wraps all public pages so they get `Navbar` + `Footer`. The root layout is now font-only.
- `admin/(protected)` wraps only authenticated admin pages, preventing `login/` from entering an auth redirect loop.
- `admin/layout.tsx` is a bare pass-through so the login page renders without sidebar or auth checks.

The home page is a single scrollable page. Each section is a `<section>` with an `id`:

| id            | Section    |
| ------------- | ---------- |
| _(none)_      | Hero       |
| `#about`      | About      |
| `#experience` | Experience |
| `#work`       | Projects   |
| `#contact`    | Contact    |

---

## 3. Component Architecture

Each page section has a **container component** that owns layout and data, and **sub-components** that accept typed props.

```
components/
  hero/         → Hero.tsx (container) + HeroBadge, HeroHeading, HeroDescription, HeroActions, HeroSocials, Marquee, Stats
  about/        → About.tsx + AboutHeader, AboutContent, AboutQuote, HighlightCard, HighlightGrid
  experience/   → Experience.tsx + ExperienceHeader, ExperienceItem, ExperienceStats
  projects/     → Projects.tsx + ProjectsHeader, ProjectsTableHeader, ProjectRow, ProjectsCursorPreview
  contact/      → Contact.tsx + ContactInfo, ContactForm, ContactField, ContactSuccess
  layout/       → Navbar.tsx, footer/ (Footer.tsx, FooterBrand.tsx, FooterLinks.tsx, FooterBottom.tsx)
```

### Rules

- **Container components** destructure data and pass typed props down. They contain section layout.
- **Sub-components** are presentational; they never fetch data.
- Client interactivity requires `"use client"` at the top of the file. Keep it at the lowest-level component that needs it — not on containers unless they use hooks.
- `"use client"` is on: `Navbar`, `Hero`, `About`, `Experience`, `Projects`, `ProjectRow`, `ContactForm`, `ExperienceItem`, and the project detail page.

---

## 4. Data Layer

Static/seed data lives in `/data/`:

| File                 | Exports                                                   | Type source            |
| -------------------- | --------------------------------------------------------- | ---------------------- |
| `data/hero.ts`       | `heroData: HeroData`                                      | `types/hero.ts`        |
| `data/about.ts`      | `aboutData: AboutData`                                    | `types/about.ts`       |
| `data/experience.ts` | `EXPERIENCES: Experience[]`, `CAREER_STATS: CareerStat[]` | `types/experience.ts`  |
| `data/footer.ts`     | `NAV_LINKS`, `SOCIAL_LINKS`                               | inline (plain objects) |
| `types/projects.ts`  | `PROJECTS: Project[]`                                     | same file (co-located) |

Data files import their types and export named constants. There is no CMS integration yet for the public site; data is edited directly in these files.

---

## 5. TypeScript Conventions

- Path alias: `@/*` maps to the workspace root.
- Type files live in `/types/`. Types are exported as named types, not interfaces except when extension is needed.
- `types/index.ts` is currently empty — do not re-export from it yet; import directly from the relevant type file.
- Types for `Project` and its helper `getProjectBySlug` are co-located in `types/projects.ts`.

---

## 6. Styling System

### Tailwind v4 + `@theme`

Tailwind v4 uses `@theme` in `globals.css` instead of a `tailwind.config.ts`. **Do not create a `tailwind.config.ts`**.

```css
/* globals.css — @theme block (design tokens) */
--color-bg: #1c1b17 → bg-bg --color-bg-darker: #131210 → bg-bg-darker
  --color-bg-surface: #232218 → bg-bg-surface --color-cream: #fdfff0 →
  text-cream --color-cream-dim: #e2e4d8 → text-cream-dim --color-muted: #b8baae
  → text-muted --color-muted-dark: #6a6860 → text-muted-dark
  --color-violet: #7c5cfc → text-violet / bg-violet --color-border: #2e2c26 →
  border-border --spacing-dot: 5px → gap-dot --width-container: 75rem;
```

These tokens are usable as Tailwind utilities directly: `bg-bg`, `text-cream`, `border-border`, `text-violet`, etc.

CSS variables are also defined in `:root` and used inline via `var(--violet)`, `var(--cream)`, etc. Both forms are present in the codebase — prefer Tailwind utility classes for new code, fall back to `var(--x)` for styles not expressible as utilities, or when using `style={{ }}` props.

### Typography

| Use                           | Font    | Class pattern                                                                                          |
| ----------------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| Headings (`h1`–`h6`)          | Onest   | Applied globally via `@layer base`; font-weight 900, uppercase, tracking `-0.02em`                     |
| Body text                     | Manrope | Default `font-family` on `html/body`                                                                   |
| Inline display font reference | —       | `font-family: var(--font-display), sans-serif` or `font-[family-name:var(--font-display)]` in Tailwind |
| Inline body font reference    | —       | `font-[family-name:var(--font-body)]`                                                                  |

The `--font-onest` and `--font-manrope` CSS variables are injected by `next/font` on the `<html>` element.

### Reusable CSS utility classes (defined in `@layer utilities`)

| Class                 | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `.container`          | `max-w-[1200px]` centered, `px-6` (mobile `px-4`)        |
| `.btn-fill`           | Filled button: cream bg, dark text, uppercase, 13px      |
| `.btn-ghost`          | Ghost button: transparent, muted border, uppercase, 13px |
| `.label`              | 11px uppercase, widest tracking, muted-dark color        |
| `.section-header-bar` | Border-bottom + `py-6` separator                         |

### Section container pattern

All sections use this wrapper:

```tsx
<section id="x" className="bg-bg py-20 lg:py-32">
  <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
    {/* Section label */}
    <span className="block text-[11px] uppercase tracking-widest text-violet mb-4">
      Section Name
    </span>
    {/* content */}
  </div>
</section>
```

### Section label pattern

Every section starts with a small "eyebrow" label:

```tsx
<span className="block text-[11px] uppercase tracking-widest text-violet mb-4">
  Label Text
</span>
```

### Tech/stack tag pattern

Used in Projects and Experience:

```tsx
<span className="text-[10px] uppercase tracking-wider text-muted-dark bg-bg-darker px-2 py-1">
  {tech}
</span>
```

---

## 7. Responsive Strategy

- **Breakpoints**: standard Tailwind (`sm: 640px`, `md: 768px`, `lg: 1024px`).
- Desktop sections use `lg:grid-cols-[...]` or `md:grid-cols-2`.
- Mobile vs desktop rendering inside components uses either responsive class variants or the `useIsMobile` hook (threshold 768px).
- `useIsMobile` is used when JS logic needs to conditionally run (e.g., disabling `mousemove` tracking on mobile for `ProjectsCursorPreview`).
- Navbar collapses to a hamburger at `< lg`.

---

## 8. Component-Specific Notes

### Navbar (`components/layout/Navbar.tsx`)

- Fixed, `z-100`, `bg-bg-darker`.
- Logo: `RG.` — clicking scrolls to top.
- Smooth-scroll via `scrollIntoView({ behavior: "smooth" })` with 300ms delay after menu close.
- Mobile menu locks `body` scroll while open.
- `NAV_LINKS` is defined inline in the component (not imported from `data/`).

### Footer (`components/layout/footer/Footer.tsx`)

- Client component; uses `useIsMobile`.
- Composed of three sub-components: `FooterBrand` (logo + tagline + email), `FooterLinks` (nav + social columns), `FooterBottom` (copyright bar).
- Data comes from `data/footer.ts` (`NAV_LINKS`, `SOCIAL_LINKS`).
- `bg-bg-darker`, two-row layout: top row (brand + links) separated by `border-border`, bottom row (copyright).

### Hero (`components/hero/Hero.tsx`)

- Full-viewport height (`min-h-screen`), `bg-bg`.
- Data flows from `heroData` in `data/hero.ts`.
- `Marquee` is a CSS-animated infinite ticker (doubled array trick, `animate-[marquee_28s_linear_infinite]`).
- `Stats` component is commented out in `Hero.tsx` — keep it that way unless asked to re-enable.

### Projects (`components/projects/Projects.tsx`)

- `PROJECTS` constant is in `types/projects.ts` (co-located with types).
- Desktop: cursor-tracked image preview (`ProjectsCursorPreview`) uses `mousemove` on the section ref, passes `x/y` relative to section.
- Each `ProjectRow` is clickable → `router.push(/projects/${slug})`.
- Desktop layout grid: `grid-cols-[64px_1fr_160px_80px_80px]`.

### Project Detail (`app/projects/[slug]/page.tsx`)

- Client component.
- Image/video gallery with active index state + lightbox (keyboard nav: Escape, ArrowLeft, ArrowRight).
- Scroll locked while lightbox is open.
- `getProjectBySlug` helper is in `types/projects.ts`.

### Experience (`components/experience/Experience.tsx`)

- Accordion pattern: one item open at a time (`openId` state); default open is `id: 1`.
- Layout: `lg:grid-cols-[1fr_2fr]` (header+stats left, list right).
- Expand/collapse via `max-h-0` / `max-h-125` with `transition-all duration-300`.

### Contact (`components/contact/Contact.tsx`)

- Two-column layout (`lg:grid-cols-2`): `ContactInfo` (left) + `ContactForm` (right).
- Form: react-hook-form + `zodResolver(contactSchema)`.
- `contactSchema` in `lib/validation/contact.ts` — name, email (string email), message (all required).
- On success: shows `ContactSuccess` component with a reset button.
- Server errors shown inline below the form fields.

### ContactField (`components/contact/ContactField.tsx`)

- Accepts `registration: UseFormRegisterReturn` — spread with `{...registration}`.
- Supports `textarea` boolean prop; defaults to `<input>`.
- Errors rendered as `<span className="text-red-400 text-[12px]">`.

---

## 9. Auth & Admin

### Proxy (`proxy.ts`) — replaces `middleware.ts`

Next.js 16 deprecates `middleware.ts` in favour of `proxy.ts` (export name `proxy` instead of `middleware`).

- Protects all `/admin/*` routes except `/admin/login`.
- Uses `lib/supabase-middleware.ts` (`updateSession`) which calls `@supabase/ssr` `createServerClient`.
- Unauthenticated users → redirect to `/admin/login`.
- Authenticated users on `/admin/login` → redirect to `/admin`.
- Matcher: `["/admin/:path*"]`.
- **Do not create a `middleware.ts`** — it conflicts with `proxy.ts` and will throw.

### Admin shell components

```
components/admin/
  AdminSidebar.tsx   ← Sidebar UI; accepts collapsed + onToggle props
  AdminShell.tsx     ← Client component; owns collapsed state, renders sidebar + main offset
```

**`AdminShell`** is a `"use client"` wrapper rendered by the `(protected)` layout. It holds `useState(collapsed)` and passes it down to `AdminSidebar`. The main content margin transitions between `ml-56` (expanded) and `ml-14` (collapsed).

**`AdminSidebar`** shrinks to icon-only (`w-14`) when collapsed. Nav labels and the user email are hidden; icons gain `title` tooltips. A `PanelLeftClose`/`PanelLeftOpen` toggle button sits in the header.

### Supabase clients

- `lib/supabase.ts` — browser client (used by client components: login page, sign-out).
- `lib/supabase-server.ts` — async server component client (used in `(protected)/layout.tsx`).
- `lib/supabase-middleware.ts` — `updateSession` helper called by `proxy.ts`.

When implementing admin pages, use `createClient` from `lib/supabase-server.ts` for server components and route handlers.

### Environment variables required

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
CONTACT_TO_EMAIL=
```

---

## 10. API Route — Contact (`app/api/contact/route.ts`)

- Method: `POST`
- Reads `name`, `email`, `message` from `req.json()`.
- Server-side validates presence + email regex (belt-and-suspenders over client Zod schema).
- Sends email via `resend.emails.send()` with `from: "Portfolio Contact <onboarding@resend.dev>"`.
- Returns `{ success: true }` (200) or `{ error: "..." }` (400 / 500).

---

## 11. Hooks

### `useIsMobile(breakpoint = 768)`

Location: `hooks/useIsMobile.ts`

- Listens to `resize` events.
- Returns `true` when `window.innerWidth < breakpoint`.
- Initializes to `false` to avoid SSR mismatch.

---

## 12. Animation

- **Marquee**: `@keyframes marquee` defined in `globals.css`. Used via Tailwind arbitrary value `animate-[marquee_28s_linear_infinite]`. The items array is duplicated to create seamless loop.
- **Pulse**: `@keyframes pulse` defined in `globals.css` (used for the available-badge dot).
- **Transitions**: standard `transition-colors duration-200` for hover states. Accordion uses `transition-all duration-300`.
- No animation library is installed. Keep it CSS/Tailwind-only unless explicitly added.

---

## 13. File & Naming Conventions

- **Pages**: `page.tsx` in the App Router directory.
- **Components**: PascalCase, one component per file, filename matches component name.
- **Hooks**: camelCase prefixed with `use`, in `hooks/`.
- **Types**: PascalCase named exports in `types/`, one domain per file.
- **Data**: camelCase or UPPER_SNAKE for arrays (`heroData`, `PROJECTS`, `EXPERIENCES`).
- **Lib utilities**: camelCase in `lib/`.
- **No barrel files** (`index.ts` re-exports) — import directly from source files.

---

## 14. Current Status

### Working

- Public portfolio (home, project detail, contact form with Resend).
- Admin login page (`/admin/login`) — Supabase email/password auth.
- Admin `(protected)` layout with collapsible sidebar and auth guard.
- `proxy.ts` session-based route protection.

### Scaffolded (directories exist, no `page.tsx` yet)

- `/admin/(protected)/experience/` — CRUD for experience entries.
- `/admin/(protected)/projects/` — CRUD for projects.
- `/admin/(protected)/media/` — media manager.
- `/admin/(protected)/profile/` — profile settings.
- `/admin/(protected)/settings/` — app settings.

### Still empty / not implemented

- `types/index.ts` — empty, do not re-export from it.
- `types/contact.ts` — contains `SOCIALS` and `INFO` arrays used by `ContactInfo` (not a type-only file).
- Supabase database schema and table-level CRUD operations.
- The admin dashboard page (`/admin`) has a `page.tsx` but its content is a placeholder.

---

## 15. Commands

```bash
pnpm dev        # start dev server
pnpm build      # production build
pnpm lint       # ESLint
```

---

## 16. Key Patterns to Preserve

1. **Dark brutalist aesthetic** — never introduce light backgrounds or rounded corners without explicit request. Keep the raw, minimal feel.
2. **Section eyebrow labels** — every section gets the violet `text-[11px] uppercase tracking-widest` label.
3. **No animation libraries** — CSS + Tailwind only.
4. **Data in `/data/` files** — do not hardcode content strings in components.
5. **Types in `/types/`** — keep strong typing; use `z.infer<typeof schema>` for form types.
6. **Tailwind v4 `@theme`** — add new design tokens there, not in a config file.
7. **Max width `max-w-7xl`** — use this for all section containers.
8. **Font references** — `font-display` / `font-body` via CSS variables, not hardcoded font names.

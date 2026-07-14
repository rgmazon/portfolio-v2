# Project Context — portfolio-rgmazon

> Everything an AI assistant needs to know to continue working on this project consistently.

---

## 1. Tech Stack

| Layer           | Tool / Version                                                                |
| --------------- | ----------------------------------------------------------------------------- |
| Framework       | Next.js **16.2.1** (App Router, Turbopack)                                    |
| Language        | TypeScript 5 (strict mode)                                                    |
| Runtime         | React 19.2.4                                                                  |
| Styling         | Tailwind CSS **v4** + custom `@theme` tokens                                  |
| Package manager | **pnpm**                                                                      |
| Database / Auth | Supabase (`@supabase/ssr`, `@supabase/supabase-js`)                           |
| Email           | Resend (`resend`)                                                             |
| Chat            | Groq (`groq-sdk`, `llama-3.3-70b-versatile`, streamed)                        |
| Forms           | react-hook-form + Zod + `@hookform/resolvers`                                 |
| Icons           | lucide-react                                                                  |
| Fonts           | Google Fonts via `next/font/google`: **Onest** (display) + **Manrope** (body) |

---

## 2. App Router Layout

```
app/
  layout.tsx                  ← Root layout: fonts only
  globals.css                 ← @theme tokens, :root vars, @layer base/utilities, keyframes
  (main)/
    layout.tsx                ← Public layout: fetches footer data, renders <Navbar /> + <Footer /> + <ChatBot />
    page.tsx                  ← Home: parallel Promise.all of 7 data getters, respects section visibility
    projects/[slug]/page.tsx  ← SERVER component: generateStaticParams + generateMetadata + ISR (revalidate=60)
  api/
    contact/route.ts          ← POST — Resend email; Zod-validated, HTML-escaped, honeypot
    chat/route.ts             ← POST — Groq-backed streamed chatbot
  admin/
    layout.tsx                ← Pass-through (no auth, no sidebar) so /admin/login isn't trapped in a redirect loop
    login/page.tsx            ← Public Supabase email/password login
    (protected)/              ← Route group; layout applies auth guard + <AdminShell>
      layout.tsx
      page.tsx                ← Dashboard
      hero/, about/, experience/, projects/, contact/
      media/, profile/, seo/, settings/
```

**Route group rationale:**

- `(main)` wraps public pages so they get `Navbar` + `Footer` + chat widget. The root layout is font-only.
- `admin/(protected)` wraps only authenticated admin pages. `admin/layout.tsx` is a bare pass-through so `login/` renders without sidebar or auth.

The home page is a single scrollable page. Section ids:

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
  projects/     → Projects.tsx (home section) + ProjectsHeader, ProjectsTableHeader, ProjectRow, ProjectsCursorPreview
                  ProjectDetail.tsx (client wrapper for /projects/[slug])
  contact/      → Contact.tsx + ContactInfo, ContactForm, ContactField, ContactSuccess
  layout/       → Navbar.tsx, footer/ (Footer, FooterBrand, FooterLinks, FooterBottom)
  chat/         → ChatBot.tsx (streams /api/chat)
  admin/        → AdminShell + AdminSidebar + per-section forms under admin/{about,contact,experience,hero,media,profile,projects,seo,settings}/
                  shared/ hosts generic admin-form primitives (AdminField, AdminFormShell, AdminSaveBar, AdminSection, AdminToggle)
```

### Rules

- **Container components** destructure data and pass typed props down.
- **Sub-components** are presentational; they never fetch data.
- Client interactivity requires `"use client"` at the top of the file. Keep it at the lowest-level component that needs it.

---

## 4. Data Layer

Data flows **Supabase → `lib/db.ts` → server components**. Static `/data/*.ts` files act as **fallbacks** when a Supabase row is missing.

### `lib/db.ts` — public getters (all use cached/cookieless clients)

| Function                          | Source                                  | Fallback                |
| --------------------------------- | --------------------------------------- | ----------------------- |
| `getHeroData()`                   | `profile` row                           | `data/hero.ts`          |
| `getAboutData()`                  | `profile` row                           | `data/about.ts`         |
| `getContactInfo()`                | `profile` row                           | hard-coded defaults     |
| `getExperiences()`                | `experiences` table (ordered)           | `data/experience.ts`    |
| `getCareerStats()`                | `profile` row                           | `data/experience.ts`    |
| `getProjects()`                   | `projects` table (ordered)              | `types/projects.ts`     |
| `getProjectBySlug(slug)`          | `projects` row by slug (cookieless)     | `types/projects.ts`     |
| `getProjectSlugs()`               | `projects.slug` (cookieless)            | `types/projects.ts`     |
| `getFooterData()`                 | `site_settings` + `profile`             | hard-coded defaults     |
| `getSiteVisibility()`             | `site_settings` booleans                | all `true`              |

### Supabase clients

| File                         | Use                                                                   |
| ---------------------------- | --------------------------------------------------------------------- |
| `lib/supabase.ts`            | Browser client (client components: login page, sign-out, chat widget) |
| `lib/supabase-server.ts`     | Request-scoped async server client (server components, route handlers) |
| `lib/supabase-middleware.ts` | `updateSession` helper for `proxy.ts`                                 |
| `lib/supabase-public.ts`     | **Cookieless** read-only client; safe for `generateStaticParams` and `generateMetadata` at build time |

RLS policies live in `supabase/schema.sql`. Public `SELECT` is open; writes require an authenticated session. Public signups are disabled in the Supabase dashboard — new admin users must be created manually.

---

## 5. TypeScript Conventions

- Path alias: `@/*` maps to the workspace root.
- Type files live in `/types/`. Named exports, not interfaces, except when extension is needed.
- `types/index.ts` is empty — do not re-export from it.
- `Project` and its helper `getProjectBySlug` (local fallback) are co-located in `types/projects.ts`.
- For form types, use `z.infer<typeof schema>`.

---

## 6. Styling System

### Tailwind v4 + `@theme`

Tailwind v4 uses `@theme` in `globals.css` instead of a `tailwind.config.ts`. **Do not create a `tailwind.config.ts`**.

Tokens are declared under `@theme` (generating Tailwind utilities like `bg-bg`, `text-cream`, `border-border`, `text-violet`) and mirrored in `:root` as CSS variables for inline use via `var(--violet)` etc. Prefer Tailwind utilities for new code; fall back to `var(--x)` for inline `style={{}}` or styles not expressible as utilities.

### Typography

| Use                           | Font    | Class pattern                                                                                          |
| ----------------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| Headings (`h1`–`h6`)          | Onest   | Applied globally via `@layer base`; font-weight 900, uppercase, tracking `-0.02em`                     |
| Body text                     | Manrope | Default `font-family` on `html/body`                                                                   |
| Inline display font reference | —       | `font-family: var(--font-display), sans-serif` or `font-[family-name:var(--font-display)]` in Tailwind |
| Inline body font reference    | —       | `font-[family-name:var(--font-body)]`                                                                  |

### Reusable utility classes (`@layer utilities` in `globals.css`)

| Class                 | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `.container`          | `max-w-[1200px]` centered, `px-6` (mobile `px-4`)        |
| `.btn-fill`           | Filled button: cream bg, dark text, uppercase, 13px      |
| `.btn-ghost`          | Ghost button: transparent, muted border, uppercase, 13px |
| `.label`              | 11px uppercase, widest tracking, muted-dark color        |
| `.section-header-bar` | Border-bottom + `py-6` separator                         |

### Section container pattern

```tsx
<section id="x" className="bg-bg py-20 lg:py-32">
  <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
    <span className="block text-[11px] uppercase tracking-widest text-violet mb-4">
      Section Name
    </span>
    {/* content */}
  </div>
</section>
```

### Tech/stack tag pattern

```tsx
<span className="text-[10px] uppercase tracking-wider text-muted-dark bg-bg-darker px-2 py-1">
  {tech}
</span>
```

---

## 7. Responsive Strategy

- **Breakpoints**: standard Tailwind (`sm: 640px`, `md: 768px`, `lg: 1024px`).
- Desktop sections use `lg:grid-cols-[...]` or `md:grid-cols-2`.
- Most responsive switching is via CSS classes; `useIsMobile` (hooks/useIsMobile.ts, threshold 768px) is only used where JS logic must branch (e.g., disabling `mousemove` tracking on the Projects cursor preview, and the inline-styled `ProjectDetail` page).
- Navbar collapses to a hamburger at `< lg`.

---

## 8. Component-Specific Notes

### Navbar (`components/layout/Navbar.tsx`)

Fixed, `z-100`, `bg-bg-darker`. Logo `RG.` scrolls to top. Smooth-scroll via `scrollIntoView({ behavior: "smooth" })` with 300ms delay after menu close. Mobile menu locks `body` scroll while open. `NAV_LINKS` is defined inline.

### Footer (`components/layout/footer/Footer.tsx`)

Client component; uses `useIsMobile`. Composed of three sub-components: `FooterBrand`, `FooterLinks`, `FooterBottom`. Data comes from `getFooterData()` via `(main)/layout.tsx`. `bg-bg-darker`, two-row layout separated by `border-border`.

### Hero (`components/hero/Hero.tsx`)

Full-viewport height (`min-h-screen`), `bg-bg`. Data flows from `heroData` loaded via `getHeroData()`. `Marquee` is a CSS-animated infinite ticker. `Stats` is commented out — keep it that way unless asked.

### Projects (`components/projects/Projects.tsx`)

Home-page section. `PROJECTS` fallback is in `types/projects.ts`. Desktop: cursor-tracked image preview (`ProjectsCursorPreview`) uses `mousemove` on the section ref. Each `ProjectRow` is clickable → `router.push(/projects/${slug})`. Desktop layout grid: `grid-cols-[64px_1fr_160px_80px_80px]`.

### Project detail (`app/(main)/projects/[slug]/page.tsx` + `components/projects/ProjectDetail.tsx`)

- `page.tsx` is a **server component**. Exports `revalidate = 60`, `generateStaticParams()` (returns all slugs, pre-renders at build), and `generateMetadata({ params })` (per-project title, description, OG image, Twitter card). Uses `notFound()` for unknown slugs.
- `ProjectDetail.tsx` is the client wrapper: image/video gallery with active-index state + lightbox (keyboard nav: Escape, ArrowLeft, ArrowRight). Scroll locked while lightbox is open.
- `getProjectBySlug` and `getProjectSlugs` in `lib/db.ts` use the cookieless `supabasePublic` client so they work at build time.

### Experience (`components/experience/Experience.tsx`)

Accordion pattern: one item open at a time (`openId` state); default open is `id: 1`. Layout: `lg:grid-cols-[1fr_2fr]` (header+stats left, list right). Expand/collapse via `max-h-0`/`max-h-125` with `transition-all duration-300`.

### Contact (`components/contact/Contact.tsx`)

Two-column layout (`lg:grid-cols-2`): `ContactInfo` (left) + `ContactForm` (right). Form: react-hook-form + `zodResolver(contactSchema)`. Schema in `lib/validation/contact.ts` — name, email, message, optional `website` (honeypot). On success: `ContactSuccess` with a reset button. Server errors shown inline below the form fields.

### ContactField (`components/contact/ContactField.tsx`)

Accepts `registration: UseFormRegisterReturn` — spread with `{...registration}`. Supports `textarea` boolean; defaults to `<input>`. Errors rendered as `<span className="text-red-400 text-[12px]">`.

### ChatBot (`components/chat/ChatBot.tsx`)

Public widget rendered by `(main)/layout.tsx`. Streams responses from `/api/chat` via `fetch` + `ReadableStream`.

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
  AdminShell.tsx     ← Client; owns collapsed state, renders sidebar + main offset
  shared/            ← Generic admin form primitives (AdminField, AdminFormShell, AdminSaveBar, AdminSection, AdminToggle)
  {section}/         ← Per-section forms (about, contact, experience, hero, media, profile, projects, seo, settings)
```

`AdminShell` holds `useState(collapsed)` and passes it down to `AdminSidebar`. The main content margin transitions between `ml-56` (expanded) and `ml-14` (collapsed). `AdminSidebar` shrinks to icon-only (`w-14`) when collapsed. A `PanelLeftClose`/`PanelLeftOpen` toggle sits in the header.

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
CONTACT_TO_EMAIL=
GROQ_API_KEY=
```

---

## 10. API Routes

### `app/api/contact/route.ts`

- Method: `POST`.
- Validates the body with `contactSchema` (Zod: name, email, message, optional `website`).
- **Honeypot**: if `website` is non-empty (bots fill it), returns a fake `{ success: true }` without sending the email.
- Escapes every interpolated value (`name`, `email`, `message`) in the HTML email body via an inline `escapeHtml` helper.
- Strips CR/LF from `replyTo` and `subject` (`sanitizeHeader`) to neutralise email-header injection.
- Returns `{ success: true }` (200) or `{ error: string }` (400 / 500).

### `app/api/chat/route.ts`

- Method: `POST`, body `{ messages: [{ role, content }] }`.
- Sanitises and trims to last 20 messages, content capped at 2000 chars each.
- Calls Groq `llama-3.3-70b-versatile` with a system prompt defining the assistant persona.
- Returns a streamed `text/plain` `ReadableStream` with `Cache-Control: no-cache` + `X-Content-Type-Options: nosniff`.
- **No rate limiting yet.** Plan §1.2 covers this.

---

## 11. Security

- `next.config.ts` sets global headers: `Strict-Transport-Security`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`. CSP is deferred until inline styles in `ProjectDetail.tsx` are cleaned up (plan §2.7).
- Supabase RLS is enabled on all tables; public reads, authenticated writes. Public signups are disabled in the dashboard.
- `proxy.ts` and `lib/supabase-middleware.ts` have no `console.log` — do not reintroduce.

---

## 12. Hooks

### `useIsMobile(breakpoint = 768)`

`hooks/useIsMobile.ts`. Listens to `resize`. Returns `true` when `window.innerWidth < breakpoint`. Initializes to `false` to avoid SSR mismatch (brief flash possible on mobile first paint).

---

## 13. Animation

- **Marquee**: `@keyframes marquee` in `globals.css`, used via Tailwind arbitrary value `animate-[marquee_28s_linear_infinite]`. Items array is duplicated for seamless loop.
- **Pulse**: `@keyframes pulse` in `globals.css` (used for the available-badge dot).
- **Transitions**: `transition-colors duration-200` for hover states. Accordion uses `transition-all duration-300`.
- No animation library is installed. Keep it CSS/Tailwind-only unless explicitly added.

---

## 14. File & Naming Conventions

- **Pages**: `page.tsx` in the App Router directory.
- **Components**: PascalCase, one component per file, filename matches component name.
- **Hooks**: camelCase prefixed with `use`, in `hooks/`.
- **Types**: PascalCase named exports in `types/`, one domain per file.
- **Data**: camelCase or UPPER_SNAKE for arrays (`heroData`, `PROJECTS`, `EXPERIENCES`).
- **Lib utilities**: camelCase in `lib/`.
- **No barrel files** (`index.ts` re-exports) — import directly from source files.

---

## 15. Commands

```bash
pnpm dev        # start dev server
pnpm build      # production build
pnpm lint       # ESLint
```

---

## 16. Key Patterns to Preserve

1. **Dark brutalist aesthetic** — never introduce light backgrounds or rounded corners without explicit request.
2. **Section eyebrow labels** — every section gets the violet `text-[11px] uppercase tracking-widest` label.
3. **No animation libraries** — CSS + Tailwind only.
4. **Supabase is the source of truth** — `/data/*.ts` files are fallbacks only; do not hardcode content in components.
5. **Types in `/types/`** — strong typing; use `z.infer<typeof schema>` for form types.
6. **Tailwind v4 `@theme`** — add new design tokens there, not in a config file.
7. **Max width `max-w-7xl`** — use this for all section containers.
8. **Font references** — `font-display` / `font-body` via CSS variables, not hardcoded font names.
9. **Server components by default** — only add `"use client"` when state, effects, event handlers, or browser-only APIs are required.
10. **Cookieless `supabasePublic`** is required for anything called from `generateStaticParams` or `generateMetadata` during build.

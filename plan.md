# Portfolio Optimization, Design & Security Plan

> Audit date: 2026-04-22
> Stack: Next.js 16.2.1 (App Router) · React 19.2.4 · Tailwind v4 · Supabase · Resend · Groq
> Scope: full-codebase review — security, performance, design/UX, SEO, code quality

Findings are tagged **[P0]** (critical / ship-blocker), **[P1]** (high impact, fix soon), **[P2]** (nice to have). Each item includes the offending file:line, the problem, and a concrete fix.

---

## Status (updated 2026-07-14)

### ✅ Done
- §1.1 — HTML-escape contact email body + honeypot enforced
- §1.2 — Rate limiting added (`lib/rate-limit.ts`, in-memory/per-instance): contact 3/hr/IP, chat 20/hr/IP, both return `429` + `Retry-After`
- §1.3 — Honeypot field on contact form
- §1.4 / §2.1 — Project detail page converted to server component + `generateStaticParams` + ISR (`revalidate = 60`)
- §1.5 — `console.log` removed from `proxy.ts` / `lib/supabase-middleware.ts`
- §1.6 — Security headers added in `next.config.ts` (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- §2.2 — `next/image` adopted for **public-facing** images: `ProjectsCursorPreview.tsx` and `ProjectDetail.tsx`'s `MediaItem` (`remotePatterns` scoped to Supabase Storage, AVIF/WebP formats). Admin `MediaManager.tsx` still uses `<img>` (intentionally deferred — admin-only, lower priority).
- §4.1 — `generateMetadata` added for project detail pages (title, description, OG/Twitter card)
- §5.1 / §5.2 — `PROJECT_CONTEXT.md` and `FILE_STRUCTURE.md` regenerated to match current code (route groups, `proxy.ts`, `lib/db.ts` data flow, `supabase-public.ts`)

### ⬜ Remaining, next up
- §4.2 — `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` (none exist yet)
- §2.6 — `revalidate` on the home page (`app/(main)/page.tsx` still fetches on every request)
- §2.5 — Throttle the unthrottled `mousemove` handler in `Projects.tsx`
- §3.2 — `loading.tsx` / `error.tsx` / `not-found.tsx` boundaries (none exist at any route level)
- §2.4 — `useIsMobile` hydration-mismatch flash
- §3.4 — Design token duplication (`@theme` vs `:root` in `globals.css`)
- §3.3 — Accessibility pass (focus-visible rings, lightbox focus trap, contrast, reduced motion)
- Everything else in the original plan below not listed above (§1.7 RLS verification requires Supabase dashboard access — not code; §1.8, §1.9, §2.3, §2.7–2.9, §3.1, §3.5–3.7, §5.3–5.6, §6) is still open, unprioritized.

---

## 1. Security

### 1.1 [P0] HTML email injection in contact route
**File:** [app/api/contact/route.ts:30-38](app/api/contact/route.ts#L30-L38)

The `name`, `email`, and `message` fields are interpolated **raw** into an HTML email body. A malicious sender can inject `<script>`, `<img onerror>`, or `<a href="javascript:…">` payloads that execute in your inbox client (Gmail/Outlook strip most, but not all — Apple Mail and many newsletter clients render).

**Fix:**
- Escape every interpolated value (`&`, `<`, `>`, `"`, `'`) before insertion, or
- Use Resend's `react` body with React components (auto-escaped), or
- Send `text:` only, drop `html:` entirely (simplest).

Also harden `replyTo`: the email regex passes addresses with newlines stripped, but a stricter regex or `z.string().email()` server-side prevents header-injection attempts.

### 1.2 [P0] No rate limiting on `/api/contact` or `/api/chat`
**Files:** [app/api/contact/route.ts](app/api/contact/route.ts), [app/api/chat/route.ts](app/api/chat/route.ts)

A single curl loop can:
- Burn through the Resend free-tier quota in seconds and spam your inbox.
- Drain the Groq API budget on `llama-3.3-70b-versatile` (every chat call costs tokens, and `max_tokens: 512` × unlimited calls = real money).

**Fix:** Add an IP-based rate limiter. On Vercel, use `@upstash/ratelimit` + Upstash Redis (free tier covers this). Suggested limits: contact 3/hour/IP, chat 20/hour/IP. Return `429` with `Retry-After`.

### 1.3 [P1] No bot protection on contact form
**File:** [components/contact/ContactForm.tsx](components/contact/ContactForm.tsx), [app/api/contact/route.ts](app/api/contact/route.ts)

No honeypot, no Turnstile/hCaptcha, no timing check. Bots will find this within weeks of going live.

**Fix:** Add a hidden `website` honeypot field — reject if filled. Optionally add Cloudflare Turnstile (invisible, free, no UI penalty) for a second layer.

### 1.4 [P1] Project detail page leaks anon key & queries client-side
**File:** [app/(main)/projects/[slug]/page.tsx:9-27](app/(main)/projects/[slug]/page.tsx#L9-L27)

The page is a client component that calls Supabase directly from the browser. Functionally fine (anon key is public), but:
- No SSR → bad SEO, slow LCP, "Loading…" flash.
- Bypasses any future RLS check that depends on server context.
- Couples public rendering to client JS.

**Fix:** Convert to a server component using [`lib/supabase-server.ts`](lib/supabase-server.ts). Move the lightbox/carousel into a small client child (`<ProjectGallery />`). See §2.1 and §3.2.

### 1.5 [P1] Verbose `console.log` in proxy/middleware
**File:** [proxy.ts:5](proxy.ts#L5), [lib/supabase-middleware.ts:33](lib/supabase-middleware.ts#L33)

Logs every request path and the authenticated user's email to platform logs. In Vercel that's retained and indexed.

**Fix:** Remove both `console.log` calls, or gate behind `if (process.env.NODE_ENV !== "production")`.

### 1.6 [P1] No security headers / CSP
**File:** [next.config.ts](next.config.ts) (currently empty config)

No `Content-Security-Policy`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`, or `X-Frame-Options`. Clickjacking and XSS escalation paths are open by default.

**Fix:** Add a `headers()` block in `next.config.ts` with at minimum:
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; img-src 'self' data: https://*.supabase.co; …
```
Tune CSP after testing — Supabase Storage, Google Fonts, and Resend webhooks need allow-list entries.

### 1.7 [P1] Verify Supabase Row Level Security
**File:** [supabase/schema.sql](supabase/schema.sql)

Schema defines `profile`, `site_settings`, `projects`, `experiences` tables. Confirm in the Supabase dashboard that **RLS is enabled on every table** and that:
- Public `SELECT` is allowed only on rows/columns that the home page needs.
- `INSERT`/`UPDATE`/`DELETE` are restricted to authenticated users (`auth.uid() is not null`) — ideally to a specific admin role.

Without RLS the anon key can mutate your portfolio data from any browser console.

### 1.8 [P2] Login page has no brute-force protection
**File:** `app/admin/login/page.tsx`

Supabase Auth ships a default rate limit, but it's permissive. Consider:
- Enforcing a strong password (min 12 chars, mix) at signup.
- Enabling Supabase MFA on the admin account.
- Adding the same Upstash rate limiter (5 attempts/15 min/IP).

### 1.9 [P2] `target="_blank"` audit
External links in the project detail page use `rel="noreferrer"` but not `noopener` ([app/(main)/projects/[slug]/page.tsx:425,432](app/(main)/projects/[slug]/page.tsx#L425)). Modern browsers default to `noopener` on `_blank`, but make it explicit: `rel="noopener noreferrer"`.

---

## 2. Performance

### 2.1 [P0] Project detail page is fully client-rendered
**File:** [app/(main)/projects/[slug]/page.tsx](app/(main)/projects/[slug]/page.tsx)

Three problems compound:
1. **Empty HTML on first byte.** The page ships JS, mounts, opens a Supabase connection, then renders. LCP is poor and Googlebot sees nothing without JS execution.
2. **No metadata.** Cannot export `generateMetadata` from a client component, so every project page shares the root `<title>` and OG card.
3. **Loading flash.** A "Loading…" placeholder appears for ~300-800ms on every navigation.

**Fix:**
- Make `page.tsx` a server component. Fetch the project via `lib/supabase-server.ts` in the body.
- Export `generateMetadata({ params })` to set per-project title, description, and OG image.
- Export `generateStaticParams()` to pre-render all project slugs at build time (ISR with `revalidate = 60` so admin edits propagate).
- Move only the gallery/lightbox into a client component `<ProjectGallery media={…} />`.
- Use `notFound()` from `next/navigation` instead of a custom "Project not found" div.

### 2.2 [P0] Images are `<img>` tags, not `next/image`
**Files:** [app/(main)/projects/[slug]/page.tsx:619](app/(main)/projects/[slug]/page.tsx#L619), [components/projects/ProjectsCursorPreview.tsx](components/projects/ProjectsCursorPreview.tsx), [components/admin/media/MediaManager.tsx](components/admin/media/MediaManager.tsx)

Consequences: no responsive sizing, no AVIF/WebP, no lazy loading, no blur placeholder, no built-in CLS protection. Hero/cursor-preview images are likely 2-5× larger than they need to be.

**Fix:** Replace with `next/image`. Required steps:
1. Allow your Supabase Storage host in [next.config.ts](next.config.ts):
   ```ts
   images: {
     remotePatterns: [{ protocol: "https", hostname: "<project>.supabase.co", pathname: "/storage/v1/object/public/**" }],
     formats: ["image/avif", "image/webp"],
   }
   ```
2. Use explicit `width`/`height` (or `fill` + sized parent) on every image. Add `sizes` for responsive images.
3. Set `priority` only on the LCP image (likely the hero or first visible project thumbnail).
4. Replace the `onError` hide-and-style trick with the `onError` prop or a build-time placeholder.

### 2.3 [P1] Hero is a client component that doesn't need to be
**File:** [components/hero/Hero.tsx:1](components/hero/Hero.tsx#L1)

The Hero container has no state, no effects, no event handlers — just composes presentational children. The `"use client"` directive ships ~5-10 KB of unnecessary JS for the LCP section.

**Fix:** Drop `"use client"` from `Hero.tsx`. Push it down only into `Marquee` (CSS-only animation, may not even need it), `HeroActions` (if it has handlers), or whichever child actually needs interactivity. Apply the same audit to `About.tsx`.

### 2.4 [P1] `useIsMobile` causes hydration mismatch + extra renders
**File:** [hooks/useIsMobile.ts](hooks/useIsMobile.ts)

Initialises to `false`, then flips to `true` on mount on small viewports. Mobile users see a desktop-shaped UI for one frame, plus an extra render. The `Footer` and `Projects` both consume this.

**Fix options:**
- Prefer pure CSS (`hidden lg:block` / `block lg:hidden`) — no JS needed for most cases. The cursor preview is the one legitimate use.
- For the legitimate use, set initial state by reading `window.matchMedia` inside `useState`'s initialiser (still client-only, but no flash) and subscribe via `matchMedia.addEventListener("change", …)` instead of `resize`.

### 2.5 [P1] `mousemove` listener fires every frame without throttling
**File:** [components/projects/Projects.tsx:25-39](components/projects/Projects.tsx#L25-L39)

Every mouse move triggers `setCursor`, which re-renders the entire `<Projects>` tree — including all `<ProjectRow>` children — at 60+ fps.

**Fix:** Either (a) `requestAnimationFrame`-throttle the handler, or (b) lift the cursor preview into its own ref-driven component that updates a CSS transform via `style.transform = translate(...)` directly, avoiding React renders entirely. Option (b) is the standard pattern.

### 2.6 [P1] No ISR / cache strategy on the home page
**File:** [app/(main)/page.tsx](app/(main)/page.tsx)

Seven Supabase queries fire on every request. The content changes maybe weekly.

**Fix:** Add `export const revalidate = 60;` (or 300) to the home page and project detail pages. Trigger an on-demand revalidate from the admin save handler via `revalidatePath("/")`.

### 2.7 [P2] Inline-styles wall in project detail page
The component is ~600 lines of inline-style objects. Beyond aesthetics this defeats Tailwind's atomic-class deduping and bloats SSR HTML.

**Fix:** Refactor to Tailwind utilities matching the rest of the codebase. Pairs naturally with the server-component refactor in §2.1.

### 2.8 [P2] Bundle audit
Once §2.1 lands, run `pnpm build` and inspect `.next/analyze` (add `@next/bundle-analyzer`). Expected wins:
- `lucide-react`: import per-icon (`import { Mail } from "lucide-react"`) — already tree-shakeable but verify.
- `groq-sdk`: server-only — confirm it's not in the client bundle.
- `@supabase/supabase-js` should not appear on public routes once §2.1 lands.

### 2.9 [P2] Font weights
[app/layout.tsx:7,14](app/layout.tsx#L7) loads Onest 400/700/900 and Manrope 400/500/600. If the design only uses 900 for headings and 400/500 for body, drop the unused weights to shave ~30 KB.

---

## 3. Design & UX

The brutalist aesthetic is strong and consistent; these are refinements, not redesigns.

### 3.1 [P1] Project detail page visual debt
**File:** [app/(main)/projects/[slug]/page.tsx](app/(main)/projects/[slug]/page.tsx)

The page diverges from the rest of the site:
- Uses `max-w-[1280px]` instead of the project-wide `max-w-7xl` (1152px). Header/footer wrap at a different width — visible misalignment.
- Inline `style={{ fontFamily: "var(--font-display), sans-serif" }}` everywhere instead of the global `h1` rules.
- Hover handlers use `onMouseEnter`/`onMouseLeave` setting `style.color` directly — should be Tailwind `hover:text-cream`.
- Lightbox uses Unicode `←` `→` `✕` — replace with `lucide-react` icons (`ArrowLeft`, `ArrowRight`, `X`) to match the rest of the system.

**Fix:** Refactor as part of §2.1 + §2.7.

### 3.2 [P1] Loading and error states
There are no `loading.tsx`, `error.tsx`, or `not-found.tsx` files at any route level. The current "Loading…" / "Project not found" divs in [app/(main)/projects/[slug]/page.tsx](app/(main)/projects/[slug]/page.tsx) are inline, inconsistent, and only triggered after JS mounts.

**Fix:** Add at minimum:
- `app/(main)/loading.tsx` — skeleton matching section grid.
- `app/(main)/not-found.tsx` — branded 404 with a link home.
- `app/(main)/error.tsx` — branded 500 with retry.
- `app/(main)/projects/[slug]/not-found.tsx` — when slug unknown.

### 3.3 [P1] Accessibility gaps
- **Missing alt text.** [app/(main)/projects/[slug]/page.tsx:621](app/(main)/projects/[slug]/page.tsx#L621) uses `alt=""`. For media in a project gallery, `alt={`${project.title} screenshot ${i+1}`}` is meaningful, not decorative.
- **Lightbox is not focus-trapped.** Tab key escapes to background page. Add a focus trap and `role="dialog" aria-modal="true" aria-label="Project image lightbox"`.
- **Lightbox close on overlay click** has no keyboard equivalent for the overlay (Escape works for close, but the overlay div needs `role="button"` + `tabIndex` or just rely on the explicit close button which is already there — drop the overlay click handler if so).
- **Color contrast.** `--muted-dark: #6a6860` on `--bg: #1c1b17` is roughly 3.4:1 — fails WCAG AA for body text (4.5:1) and AA-large (3:1) borderline. Used as the eyebrow label color. Consider lifting to `#8a8780` or restricting to ≥18px.
- **Focus-visible rings.** Buttons (`btn-fill`, `btn-ghost`) have no `:focus-visible` style. Keyboard users can't see where they are. Add `outline: 2px solid var(--violet); outline-offset: 2px;` in the `:focus-visible` state.
- **Skip-to-content link.** Useful for keyboard users on a long single-page site.
- **Reduced motion.** The marquee animates infinitely. Wrap in `@media (prefers-reduced-motion: reduce) { animation: none }` for the keyframes.

### 3.4 [P2] Design tokens
[app/globals.css](app/globals.css) duplicates every color: once under `@theme` (Tailwind utilities) and again under `:root` (raw CSS vars). Drift is inevitable.

**Fix:** Define each value once in `@theme`. Tailwind v4 already exposes `--color-*` tokens as CSS variables you can reference inline (`var(--color-violet)`). Drop the `:root` block. Update inline `var(--violet)` callsites to `var(--color-violet)`.

### 3.5 [P2] Motion system
The site uses CSS transitions but no consistent motion language. Consider:
- A small set of named easings/durations as CSS variables (e.g., `--ease-out-expo`, `--duration-fast: 150ms`).
- View Transitions API for the project list → project detail navigation (Next 16 supports this) — the cursor-preview image can morph into the detail hero. High-leverage win for the brutalist aesthetic.

### 3.6 [P2] Empty/edge states
- Contact success state ([components/contact/ContactSuccess.tsx](components/contact/ContactSuccess.tsx)) — confirm it visually echoes the form's structure rather than collapsing layout (causes scroll jump).
- Empty state for "no projects" / "no experience" — currently nothing renders if Supabase returns `[]`. Add a quiet placeholder.

### 3.7 [P2] Mobile lightbox UX
On mobile, the lightbox prev/next arrows are 28px and crowd the image edges. Add swipe gestures (Pointer events, no library needed for ~30 LOC) and bump touch targets to 44×44 per Apple HIG.

---

## 4. SEO & Discoverability

### 4.1 [P1] No `generateMetadata` on dynamic routes
Project detail pages have no per-project title, description, OG image, or Twitter card. Sharing a project link on Slack/Twitter shows the generic "RG Mazon — Full-Stack Developer" card.

**Fix:** Once §2.1 lands, add:
```ts
export async function generateMetadata({ params }) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) return {};
  return {
    title: `${project.title} — RG Mazon`,
    description: project.description,
    openGraph: { images: [project.media[0]?.src] },
  };
}
```

### 4.2 [P1] No sitemap, robots, or OG image
**Missing files:**
- `app/sitemap.ts` — generate from `getProjects()` + static routes.
- `app/robots.ts` — allow `/`, disallow `/admin`.
- `app/opengraph-image.tsx` (Next 16 file convention) — dynamic OG card with the brutalist aesthetic.
- `app/icon.tsx` or proper PWA-sized favicons under `public/`.
- `app/manifest.ts` — for PWA install support (low priority).

### 4.3 [P2] Structured data
Add JSON-LD `Person` and `BreadcrumbList` to the home page. Helps Google Knowledge Graph and shows rich snippets in SERPs.

### 4.4 [P2] Canonical URLs
Set `metadataBase` in the root layout and define canonical URLs per page. Prevents trailing-slash and `?utm_*` duplicate-content issues.

---

## 5. Code Quality

### 5.1 [P1] `noindex` on stale docs
`PROJECT_CONTEXT.md` and `FILE_STRUCTURE.md` document an older shape (e.g., FILE_STRUCTURE shows `app/projects/...` and `middleware.ts`, but the actual layout is `app/(main)/projects/...` and `proxy.ts`). They will lie to future contributors and to AI assistants.

**Fix:** Either delete `FILE_STRUCTURE.md` (dir tree is self-documenting) or regenerate it. Update `PROJECT_CONTEXT.md` §2 to reflect `(main)` route group placement of `projects/`, and §10 to mention `/api/chat`.

### 5.2 [P1] `lib/db.ts` is undocumented
[app/(main)/page.tsx:6](app/(main)/page.tsx#L6) imports seven loaders from `@/lib/db` but PROJECT_CONTEXT.md still describes data as living in `/data/*.ts`. Document the actual data flow (Supabase → `lib/db.ts` → server components) and decide whether `/data/*.ts` files are still used or are dead code.

### 5.3 [P2] Type safety in `/api/chat`
[app/api/chat/route.ts:142-157](app/api/chat/route.ts#L142-L157) does manual `unknown`-narrowing. Replace with a Zod schema:
```ts
const ChatRequest = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(2000),
  })).min(1).max(20),
});
```
Cleaner, validates more, and the schema doubles as documentation.

### 5.4 [P2] Co-located client/server code paths
Several components import `useState` + `useEffect` only to avoid hydration mismatches (e.g., `Footer` consumes `useIsMobile`). These often signal a CSS-only solution would be cleaner. Audit each `"use client"` directive against the four legitimate reasons (state, effects, event handlers, browser-only APIs) and demote where possible.

### 5.5 [P2] Empty `types/index.ts`
PROJECT_CONTEXT.md notes this. Either populate as a barrel and update imports, or delete it. Empty index files invite accidental imports.

### 5.6 [P2] Tooling
- Add `prettier` config + `format` script. ESLint catches errors but formatting drift is visible across the project (mixed quote styles in some files).
- Add a `typecheck` script (`tsc --noEmit`) to the package and run in CI.
- Consider `lint-staged` + Husky pre-commit (or [Lefthook](https://github.com/evilmartians/lefthook)) so commits are always formatted/linted.

---

## 6. Operations

### 6.1 [P1] No error monitoring
A 500 on `/api/contact` only logs to Vercel and dies there. Add Sentry (free tier) or Vercel's built-in observability — at minimum capture API route exceptions and client-side errors from the chat widget.

### 6.2 [P2] No analytics
If you want to measure CV downloads, project clicks, contact conversions: Plausible or Vercel Analytics, both privacy-friendly and one-line installs.

### 6.3 [P2] CI / preview deploys
Confirm Vercel is wired to the GitHub repo with required checks: `pnpm build`, `pnpm lint`, `tsc --noEmit`. Add a status check so a PR can't merge red.

---

## 7. Suggested Execution Order

A pragmatic sprint plan, two weeks of evening work:

**Week 1 — Security + perf foundation**
1. §1.1 Escape contact email HTML _(30 min)_
2. §1.5 Strip console.log calls _(5 min)_
3. §1.6 Add security headers in `next.config.ts` _(45 min)_
4. §1.2 Wire Upstash rate limiter on `/api/contact` and `/api/chat` _(2 hrs)_
5. §1.3 Add honeypot field _(20 min)_
6. §1.7 Verify Supabase RLS in dashboard _(1 hr)_
7. §2.1 Convert project detail page to RSC + ISR _(3 hrs)_
8. §4.1 Add `generateMetadata` for project pages _(30 min)_

**Week 2 — Performance + SEO + UX polish**
9. §2.2 Migrate to `next/image` + remotePatterns _(2 hrs)_
10. §2.3 Demote unnecessary `"use client"` _(1 hr)_
11. §2.5 RAF-throttle cursor preview _(45 min)_
12. §2.6 Add `revalidate` + on-demand revalidation _(1 hr)_
13. §4.2 Add sitemap, robots, opengraph-image _(1 hr)_
14. §3.2 Add loading/error/not-found boundaries _(1 hr)_
15. §3.3 Accessibility pass (focus rings, alt text, contrast, reduced motion) _(2 hrs)_
16. §3.4 Consolidate design tokens _(45 min)_
17. §5.1, §5.2 Refresh internal docs _(30 min)_

Everything in §2.7, §3.5-§3.7, §5.3-§5.6, §6 is post-launch polish.

---

## 8. Out of Scope (Noted, Not Recommended Now)

- **CMS migration.** Supabase as source-of-truth is fine for one author. Don't migrate to Sanity/Contentlayer until you have a co-editor.
- **i18n.** Single-locale portfolio. Skip until there's a business reason.
- **Edge runtime.** Resend SDK and Groq SDK both work on Node; the perf gain doesn't justify the runtime constraints.
- **PWA / offline.** A portfolio is not a PWA use case.

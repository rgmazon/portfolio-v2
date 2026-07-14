import { createClient } from "@supabase/supabase-js";

// Cookieless read-only client — safe to call at build time (generateStaticParams,
// generateMetadata during SSG) where no request context exists.
// Public data only; write access is still gated by RLS.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);

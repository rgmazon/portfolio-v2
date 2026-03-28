"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-bg-darker flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-10">
          <span className="text-cream text-2xl font-black uppercase tracking-tight">
            RG.
          </span>
          <p className="text-muted text-[11px] uppercase tracking-widest mt-1">
            Admin Panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] uppercase tracking-widest text-muted-dark mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-surface border border-border text-cream text-sm px-4 py-3 outline-none focus:border-violet transition-colors duration-200 placeholder:text-muted-dark"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[11px] uppercase tracking-widest text-muted-dark mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-surface border border-border text-cream text-sm px-4 py-3 outline-none focus:border-violet transition-colors duration-200 placeholder:text-muted-dark"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-[12px]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-fill w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
}
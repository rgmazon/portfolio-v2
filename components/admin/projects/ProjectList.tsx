"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Project } from "@/types/projects";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function ProjectList() {
  const router = useRouter();
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems((data as Project[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(id);
    await supabase.from("projects").delete().eq("id", id);
    await load();
    setDeleting(null);
  }

  return (
    <div>
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted">
          {items.length} {items.length === 1 ? "project" : "projects"}
        </p>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 btn-fill"
        >
          <Plus size={13} />
          New Project
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-muted-dark py-8 text-center">Loading…</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-dark mb-4">No projects yet.</p>
          <Link href="/admin/projects/new" className="btn-fill">
            Add First Project
          </Link>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border border border-border">
          {items.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-bg-surface transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-[10px] uppercase tracking-widest text-muted-dark tabular-nums shrink-0">
                  {project.num}
                </span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-bold uppercase tracking-tight text-cream truncate">
                    {project.title}
                  </span>
                  <span className="text-xs text-muted-dark">
                    {project.category} · {project.year}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => router.push(`/admin/projects/edit/${project.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted border border-border hover:border-cream hover:text-cream transition-colors"
                >
                  <Pencil size={11} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={deleting === project.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted border border-border hover:border-red-400 hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={11} />
                  {deleting === project.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

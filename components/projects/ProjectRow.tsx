"use client";

import { useRouter } from "next/navigation";
import { Project } from "@/types/projects";

type Props = {
  project: Project;
  index: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function ProjectRow({
  project: p,
  index,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/projects/${p.slug}`)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`cursor-pointer border-b border-border first:border-t transition-colors
      ${isHovered ? "bg-bg-surface" : "hover:bg-bg-surface"}`}
    >
      {/* MOBILE */}
      <div className="lg:hidden px-4 py-5 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span
            className={`font-display font-black uppercase text-lg transition-colors ${
              isHovered ? "text-cream" : "text-cream-dim"
            }`}
          >
            {p.title}
          </span>
          <span className="text-xs text-muted-dark">{p.year}</span>
        </div>

        <span className="text-xs text-muted-dark tracking-wide">
          {p.category}
        </span>

        <div className="flex flex-wrap gap-2 mt-1">
          {p.stack.map((t) => (
            <span
              key={t}
              className="text-[10px] uppercase tracking-wider text-muted-dark bg-bg-darker px-2 py-1"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:grid grid-cols-[64px_1fr_160px_80px_80px] items-center gap-4 h-18 px-7">
        <span className="text-xs text-muted-dark tracking-wide">
          {p.num}
        </span>

        <div className="flex flex-col gap-1">
          <span
            className={`font-display font-black uppercase text-lg transition-colors ${
              isHovered ? "text-cream" : "text-cream-dim"
            }`}
          >
            {p.title}
          </span>
          <span className="text-sm text-muted-dark">{p.category}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {p.stack.slice(0, 2).map((t) => (
            <span
              key={t}
              className="text-[10px] uppercase tracking-wider text-muted-dark bg-bg-darker px-2 py-1"
            >
              {t}
            </span>
          ))}
        </div>

        {/* GH */}
        <div>
          {p.github ? (
            <a
              href={p.github}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs uppercase tracking-wider text-muted-dark hover:text-cream transition-colors"
            >
              GH ↗
            </a>
          ) : (
            <span className="text-xs text-border">—</span>
          )}
        </div>

        {/* URL */}
        <div>
          {p.url ? (
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs uppercase tracking-wider text-muted-dark hover:text-cream transition-colors"
            >
              URL ↗
            </a>
          ) : (
            <span className="text-xs text-border">—</span>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { Project } from "@/types/projects";

type Props = {
  projects: Project[];
  hoveredId: string | null;
  cursor: { x: number; y: number };
};

export default function ProjectsCursorPreview({
  projects,
  hoveredId,
  cursor,
}: Props) {
  return (
    <div
      className={`pointer-events-none absolute z-50 w-70 h-45 
      bg-bg-surface overflow-hidden transition-opacity duration-200
      ${hoveredId ? "opacity-100" : "opacity-0"}`}
      style={{
        top: cursor.y,
        left: cursor.x,
        transform: "translate(24px, -50%)",
      }}
    >
      {projects.map((p) => (
        <img
          key={p.id}
          src={p.media[0]?.src}
          alt={p.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            hoveredId === p.id ? "opacity-100" : "opacity-0"
          }`}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      ))}

      {/* fallback */}
      <div className="absolute inset-0 flex items-center justify-center">
        {hoveredId && (
          <span className="text-[11px] uppercase tracking-widest text-muted-dark font-display font-black">
            {projects.find((p) => p.id === hoveredId)?.title}
          </span>
        )}
      </div>
    </div>
  );
}
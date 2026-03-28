"use client";

import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { Project } from "@/types/projects";

import ProjectsHeader from "./ProjectsHeader";
import ProjectsTableHeader from "./ProjectsTableHeader";
import ProjectRow from "./ProjectRow";
import ProjectsCursorPreview from "./ProjectsCursorPreview";

type Props = { projects: Project[] };

export default function Projects({ projects }: Props) {
  const isMobile = useIsMobile();

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();

      setCursor({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const el = sectionRef.current;
    el?.addEventListener("mousemove", onMove);

    return () => el?.removeEventListener("mousemove", onMove);
  }, [isMobile]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-bg py-20 lg:py-32"
    >
      {/* Cursor preview */}
      {!isMobile && (
        <ProjectsCursorPreview
          projects={projects}
          hoveredId={hoveredId}
          cursor={cursor}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Label */}
        <span className="block text-[11px] uppercase tracking-widest text-violet mb-4">
          Featured Work
        </span>

        <ProjectsHeader />
        <ProjectsTableHeader />

        <div className="flex flex-col">
          {projects.map((p, i) => (
            <ProjectRow
              key={p.id}
              project={p}
              index={i}
              isHovered={hoveredId === p.id}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
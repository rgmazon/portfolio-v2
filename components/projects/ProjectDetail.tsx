"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Project, ProjectMedia } from "@/types/projects";
import { useIsMobile } from "@/hooks/useIsMobile";

type Props = { project: Project };

export default function ProjectDetail({ project }: Props) {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // close lightbox on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i + 1) % project.media.length);
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i - 1 + project.media.length) % project.media.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, project.media.length]);

  // lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div
        style={{
          background: "var(--bg)",
          minHeight: "100vh",
          paddingTop: 64,
        }}
      >
        {/* BACK BUTTON */}
        <div
          style={{
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: isMobile ? "32px 16px 0" : "48px 24px 0",
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body), sans-serif",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--muted)",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cream)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            ← Back
          </button>
        </div>

        {/* HERO HEADER */}
        <div
          style={{
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: isMobile ? "32px 16px 48px" : "48px 24px 64px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 32 : 80,
            alignItems: "end",
          }}
        >
          {/* LEFT */}
          <div>
            <span
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--violet)",
                display: "block",
                marginBottom: 16,
              }}
            >
              {project.num} — {project.category}
            </span>

            <h1
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontWeight: 900,
                fontSize: isMobile ? "clamp(40px, 12vw, 64px)" : "clamp(48px, 6vw, 80px)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: "var(--cream)",
                margin: "0 0 24px",
              }}
            >
              {project.title}
            </h1>

            <p
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: 15,
                color: "var(--muted)",
                lineHeight: 1.8,
                maxWidth: 480,
              }}
            >
              {project.description}
            </p>
          </div>

          {/* RIGHT — META */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
            }}
          >
            {[
              { label: "Role",     value: project.role     },
              { label: "Year",     value: project.year     },
              { label: "Type",     value: project.type     },
              { label: "Category", value: project.category },
            ].map((m, i) => (
              <div
                key={m.label}
                style={{
                  padding: "20px 0",
                  borderTop: i < 2 ? "none" : "1px solid var(--border)",
                  paddingRight: i % 2 === 0 ? 24 : 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted-dark)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {m.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display), sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    color: "var(--cream-dim)",
                  }}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MEDIA CAROUSEL */}
        <div
          style={{
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: isMobile ? "0 16px" : "0 24px",
            marginBottom: isMobile ? 48 : 80,
          }}
        >
          {/* MAIN MEDIA */}
          <div
            style={{
              width: "100%",
              aspectRatio: "16/9",
              background: "var(--bg-surface)",
              overflow: "hidden",
              cursor: "zoom-in",
              position: "relative",
            }}
            onClick={() => openLightbox(activeIndex)}
          >
            <MediaItem
              item={project.media[activeIndex]}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              style={{ objectFit: "cover" }}
            />

            {/* ZOOM HINT */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                background: "rgba(0,0,0,0.6)",
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                Click to expand
              </span>
            </div>
          </div>

          {/* THUMBNAILS */}
          {project.media.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: 2,
                marginTop: 2,
              }}
            >
              {project.media.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    flex: 1,
                    aspectRatio: "16/9",
                    background: "var(--bg-surface)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    overflow: "hidden",
                    opacity: activeIndex === i ? 1 : 0.4,
                    transition: "opacity 0.2s",
                    position: "relative",
                  }}
                >
                  <MediaItem
                    item={item}
                    thumbnail
                    fill
                    sizes="200px"
                    style={{ objectFit: "cover" }}
                  />
                  {/* video indicator */}
                  {item.type === "video" && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-body), sans-serif",
                          fontSize: 10,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--cream)",
                          background: "rgba(0,0,0,0.5)",
                          padding: "4px 8px",
                        }}
                      >
                        ▶ Video
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TECH STACK + LINKS */}
        <div
          style={{
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: isMobile ? "0 16px 80px" : "0 24px 120px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 48 : 80,
            alignItems: "start",
          }}
        >
          {/* STACK */}
          <div>
            <span
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted-dark)",
                display: "block",
                marginBottom: 20,
              }}
            >
              Tech Stack
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--cream-dim)",
                    background: "var(--bg-surface)",
                    padding: "8px 16px",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* LINKS */}
          <div>
            <span
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted-dark)",
                display: "block",
                marginBottom: 20,
              }}
            >
              Links
            </span>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <button className="btn-fill">
                    Live Site ↗
                  </button>
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <button className="btn-ghost">
                    GitHub ↗
                  </button>
                </a>
              )}
              {!project.url && !project.github && (
                <span
                  style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontSize: 13,
                    color: "var(--muted-dark)",
                  }}
                >
                  No public links available.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(13, 12, 10, 0.96)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* CLOSE */}
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-display), sans-serif",
              fontWeight: 900,
              fontSize: 24,
              color: "var(--muted)",
              lineHeight: 1,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cream)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            ✕
          </button>

          {/* COUNTER */}
          <div
            style={{
              position: "absolute",
              top: 28,
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-body), sans-serif",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted-dark)",
            }}
          >
            {lightboxIndex + 1} / {project.media.length}
          </div>

          {/* MEDIA */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90vw",
              maxWidth: 1100,
              height: "85vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <MediaItem
              item={project.media[lightboxIndex]}
              fill
              sizes="(max-width: 1100px) 90vw, 1100px"
              style={{ objectFit: "contain" }}
              controls
            />
          </div>

          {/* PREV / NEXT */}
          {project.media.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i - 1 + project.media.length) % project.media.length);
                }}
                style={{
                  position: "absolute",
                  left: isMobile ? 8 : 32,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-display), sans-serif",
                  fontWeight: 900,
                  fontSize: 28,
                  color: "var(--muted)",
                  transition: "color 0.2s",
                  padding: "16px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cream)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                ←
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i + 1) % project.media.length);
                }}
                style={{
                  position: "absolute",
                  right: isMobile ? 8 : 32,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-display), sans-serif",
                  fontWeight: 900,
                  fontSize: 28,
                  color: "var(--muted)",
                  transition: "color 0.2s",
                  padding: "16px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cream)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                →
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

/* ── MEDIA ITEM ──────────────────────────────────────────────── */

function MediaItem({
  item,
  style,
  thumbnail = false,
  controls = false,
  fill = false,
  sizes,
}: {
  item: ProjectMedia;
  style?: React.CSSProperties;
  thumbnail?: boolean;
  controls?: boolean;
  fill?: boolean;
  sizes?: string;
}) {
  if (item.type === "video") {
    return (
      <video
        src={item.src}
        poster={item.poster}
        controls={controls && !thumbnail}
        muted={thumbnail}
        loop={thumbnail}
        playsInline
        style={style}
      />
    );
  }

  return (
    <Image
      src={item.src}
      alt=""
      fill={fill}
      sizes={sizes}
      style={style}
    />
  );
}

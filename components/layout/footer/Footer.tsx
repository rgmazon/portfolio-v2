"use client";

import { NAV_LINKS } from "@/data/footer";
import type { FooterData } from "@/lib/db";

type Props = { data: FooterData };

export default function Footer({ data }: Props) {
  const { tagline, copyright, email, socials } = data;

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-bg-darker w-full">

      {/* TOP ROW */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 py-16 lg:py-20 border-b border-border">

          {/* LEFT — LOGO + TAGLINE */}
          <div className="flex flex-col gap-4 max-w-xs">
            <span className="font-(family-name:--font-display) font-black text-[22px] tracking-[0.04em] uppercase text-cream">
              RGM
            </span>
            <p className="font-(family-name:--font-body) text-[14px] text-muted leading-[1.7] m-0">
              {tagline}
            </p>
            <a
              href={`mailto:${email}`}
              className="font-(family-name:--font-body) text-[12px] tracking-[0.06em] uppercase text-violet no-underline transition-colors duration-200 hover:text-cream self-start"
            >
              {email}
            </a>
          </div>

          {/* RIGHT — NAV + SOCIAL */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 lg:items-start">

            {/* NAV */}
            <div className="flex flex-col gap-3">
              <span className="font-(family-name:--font-body) text-[10px] tracking-[0.12em] uppercase text-muted-dark mb-1">
                Navigation
              </span>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="font-(family-name:--font-body) text-[13px] tracking-[0.06em] uppercase text-muted no-underline transition-colors duration-200 hover:text-cream self-start"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* SOCIAL */}
            <div className="flex flex-col gap-3">
              <span className="font-(family-name:--font-body) text-[10px] tracking-[0.12em] uppercase text-muted-dark mb-1">
                Elsewhere
              </span>
              {socials.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-(family-name:--font-body) text-[13px] tracking-[0.06em] uppercase text-muted no-underline transition-colors duration-200 hover:text-cream self-start"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>

          </div>
        </div>

        {/* BOTTOM ROW — COPYRIGHT */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 py-6">
          <span className="font-(family-name:--font-body) text-[11px] tracking-[0.08em] uppercase text-muted-dark">
            {copyright}
          </span>
          <span className="font-(family-name:--font-body) text-[11px] tracking-[0.08em] uppercase text-muted-dark">
            Designed & Built by{" "}
            <span className="text-muted">RG Mazon</span>
          </span>
        </div>
      </div>

    </footer>
  );
}
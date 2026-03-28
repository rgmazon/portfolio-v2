"use client";

import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { label: "Work",       href: "#work"       },
  { label: "About",      href: "#about"      },
  { label: "Experience", href: "#experience" },
  { label: "Contact",    href: "#contact"    },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setVisible(current < lastScrollY.current || current < 80);
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <>
      {/* ── NAVBAR BAR ───────────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-100 bg-(--bg-darker) transition-transform duration-300 ease-in-out"
        style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 md:px-6">

          {/* LOGO */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="mr-10 flex h-14 w-14 shrink-0 items-center justify-center text-[13px] font-black tracking-[0.05em] text-cream no-underline transition-colors duration-200 hover:text-violet"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            RG<span className="text-primary">.</span>
          </a>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden flex-1 items-center justify-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-[12px] uppercase tracking-[0.08em] text-muted no-underline transition-colors duration-200 hover:text-cream"
                style={{ fontFamily: "var(--font-body), sans-serif" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex-1 lg:hidden" />

          {/* HIRE ME (desktop) */}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}
            className="hidden lg:block"
          >
            <button className="btn-fill text-[12px]">Hire Me</button>
          </a>

          {/* HAMBURGER (mobile) */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex cursor-pointer flex-col items-center justify-center gap-dot border-none bg-transparent p-2 lg:hidden"
          >
            <span
              className="block h-[1.5px] w-6 bg-cream transition-transform duration-300"
              style={{ transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none" }}
            />
            <span
              className="block h-[1.5px] w-6 bg-cream transition-opacity duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block h-[1.5px] w-6 bg-cream transition-transform duration-300"
              style={{ transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>
      </header>

      {/* ── FULLSCREEN MOBILE MENU ───────────────────────────────── */}
      <div
        className={`fixed inset-0 z-99 flex flex-col items-start justify-center bg-(--bg-darker) px-4 transition-opacity duration-300 md:px-6 ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex w-full flex-col gap-2">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="block py-3 text-[clamp(36px,10vw,72px)] font-black uppercase tracking-[-0.02em] text-cream no-underline transition-[color,opacity,transform] duration-300 hover:text-violet"
              style={{
                fontFamily: "var(--font-display), sans-serif",
                transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(12px)",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}
          className="mt-10 transition-[opacity,transform] duration-300"
          style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(12px)",
            transitionDelay: menuOpen ? `${NAV_LINKS.length * 60}ms` : "0ms",
          }}
        >
          <button className="btn-fill">Hire Me</button>
        </a>
      </div>
    </>
  );
}
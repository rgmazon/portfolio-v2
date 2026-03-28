import { NAV_LINKS, SOCIAL_LINKS } from "@/data/footer";

export default function FooterLinks() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 lg:items-end">

      {/* NAV */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] tracking-[0.12em] uppercase text-muted-dark mb-1">
          Navigation
        </span>

        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(link.href);
            }}
            className="text-[13px] tracking-[0.06em] uppercase text-muted no-underline transition-colors duration-200 hover:text-cream"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* SOCIAL */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] tracking-[0.12em] uppercase text-muted-dark mb-1">
          Elsewhere
        </span>

        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="text-[13px] tracking-[0.06em] uppercase text-muted no-underline transition-colors duration-200 hover:text-cream"
          >
            {link.label} ↗
          </a>
        ))}
      </div>

    </div>
  );
}
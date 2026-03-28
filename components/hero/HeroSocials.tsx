import { Social } from "@/types/hero";

type Props = {
  socials: Social[];
};

export default function HeroSocials({ socials }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <span className="text-xs uppercase tracking-widest text-muted">
        Find me on
      </span>

      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${s.label}`}
          className="text-xs uppercase tracking-widest text-muted transition hover:text-cream"
        >
          {s.label}
        </a>
      ))}
    </div>
  );
}
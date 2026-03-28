export default function FooterBrand() {
  return (
    <div className="flex flex-col gap-4 max-w-xs">
      <span className="font-(family-name:--font-display) font-black text-[22px] tracking-[0.04em] uppercase text-cream">
        RGM
      </span>

      <p className="font-(family-name:--font-body) text-[14px] text-muted leading-[1.7] m-0">
        Full-stack developer crafting fast, functional, and brutally
        honest digital experiences.
      </p>

      <a
        href="mailto:hello@rgmazon.com"
        className="font-(family-name:--font-body) text-[12px] tracking-[0.06em] uppercase text-violet no-underline transition-colors duration-200 hover:text-cream self-start"
      >
        hello@rgmazon.com
      </a>
    </div>
  );
}
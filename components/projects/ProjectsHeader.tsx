export default function ProjectsHeader() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-12">
      <h2 className="font-display font-black uppercase leading-none tracking-tight text-cream text-[clamp(32px,4vw,52px)]">
        Things I've <span className="text-muted-dark">built.</span>
      </h2>

      <a
        href="https://github.com/rgmazon"
        target="_blank"
        rel="noreferrer"
        className="text-xs uppercase tracking-wider text-muted hover:text-cream transition-colors"
      >
        View all on GitHub →
      </a>
    </div>
  );
}
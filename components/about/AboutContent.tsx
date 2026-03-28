type Props = {
  title: string;
  subtitle: string;
  paragraphs: string[];
};

export default function AboutContent({ title, subtitle, paragraphs }: Props) {
  return (
    <div>
      <h2 className="mb-8 text-[clamp(28px,8vw,40px)] font-black uppercase leading-tight tracking-tight text-cream md:text-[clamp(32px,4vw,52px)]">
        {title}{" "}
        <span className="text-muted-dark">{subtitle}</span>
      </h2>

      {paragraphs.map((p, i) => (
        <p
          key={i}
          className="mb-5 max-w-prose text-sm leading-relaxed text-muted md:text-base"
        >
          {p}
        </p>
      ))}
    </div>
  );
}
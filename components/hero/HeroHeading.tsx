type Props = {
  title: string;
  subtitle: string;
};

export default function HeroHeading({ title, subtitle }: Props) {
  return (
    <h1 className="text-cream leading-[0.95] text-[clamp(48px,14vw,72px)] md:text-[clamp(52px,8vw,96px)]">
      {title}
      <br />
      <span className="text-muted-dark">
        {subtitle.split("WEB.")[0]}{" "}
        <span className="text-violet">WEB.</span>
      </span>
    </h1>
  );
}
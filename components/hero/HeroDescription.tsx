type Props = {
  text: string;
};

export default function HeroDescription({ text }: Props) {
  return (
    <p className="mt-6 mb-10 max-w-prose text-base leading-relaxed text-muted">
      {text}
    </p>
  );
}
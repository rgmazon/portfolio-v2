type Props = {
  quote: string;
  author: string;
};

export default function AboutQuote({ quote, author }: Props) {
  return (
    <div className="mt-8 border-l-2 border-violet pl-6">
      <p className="mb-2 text-base italic leading-relaxed text-cream-dim md:text-lg">
        "{quote}"
      </p>
      <span className="text-xs uppercase tracking-widest text-muted-dark">
        — {author}
      </span>
    </div>
  );
}
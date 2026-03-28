type Props = {
  text: string;
};

export default function HeroBadge({ text }: Props) {
  return (
    <div className="mb-6">
      <span className="inline-flex items-center gap-2 px-3 py-1 text-sm text-cream-dim">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        {text}
      </span>
    </div>
  );
}
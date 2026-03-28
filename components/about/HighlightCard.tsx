import { Highlight } from "@/types/about";

type Props = {
  item: Highlight;
};

export default function HighlightCard({ item }: Props) {
  return (
    <div className="flex flex-col gap-2 bg-bg-surface p-5 transition-colors hover:bg-bg-darker md:p-6">
      <span className="text-3xl font-black leading-none text-cream md:text-4xl">
        {item.num}
      </span>

      <span className="text-[10px] font-bold uppercase tracking-wider text-cream-dim">
        {item.label}
      </span>

      <p className="text-xs leading-relaxed text-muted-dark">
        {item.desc}
      </p>
    </div>
  );
}
import { Highlight } from "@/types/about";
import HighlightCard from "./HighlightCard";

type Props = {
  items: Highlight[];
};

export default function HighlightGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-2 gap-px bg-bg-darker">
      {items.map((item) => (
        <HighlightCard key={item.label} item={item} />
      ))}
    </div>
  );
}
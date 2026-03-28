import type { CareerStat } from "@/types/experience";

type Props = { stats: CareerStat[] };

export default function ExperienceStats({ stats }: Props) {
  return (
    <div>
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex items-baseline gap-3 py-4 border-b border-border ${
            i === 0 ? "border-t" : ""
          }`}
        >
          <span className="font-display font-black text-3xl text-cream">
            {s.num}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-muted-dark">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
"use client";

import { useState } from "react";
import type { Experience as ExperienceType, CareerStat } from "@/types/experience";
import ExperienceItem from "./ExperienceItem";
import ExperienceHeader from "./ExperienceHeader";
import ExperienceStats from "./ExperienceStats";

type Props = {
  experiences: ExperienceType[];
  stats: CareerStat[];
};

export default function Experience({ experiences, stats }: Props) {
  const [openId, setOpenId] = useState<string | null>(
    () => experiences[0]?.id ?? null
  );

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="experience" className="bg-bg py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Label */}
        <span className="block text-[11px] uppercase tracking-widest text-violet mb-4">
          Experience
        </span>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">
          {/* Left */}
          <div>
            <ExperienceHeader />
            <ExperienceStats stats={stats} />
          </div>

          {/* Right */}
          <div>
            {experiences.map((exp) => (
              <ExperienceItem
                key={exp.id}
                exp={exp}
                isOpen={openId === exp.id}
                onToggle={() => toggle(exp.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import Marquee from "@/components/hero/Marquee";
// import Stats from "@/components/hero/Stats";

import HeroBadge from "./HeroBadge";
import HeroHeading from "./HeroHeading";
import HeroDescription from "./HeroDescription";
import HeroActions from "./HeroActions";
import HeroSocials from "./HeroSocials";

import type { HeroData } from "@/types/hero";

type Props = { data: HeroData };

export default function Hero({ data }: Props) {
  const { badge, title, subtitle, description, skills, stats, socials } = data;

  return (
    <section className="flex min-h-screen flex-col bg-bg">
      
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-24 md:px-6">
        
        <HeroBadge text={badge} />

        <HeroHeading title={title} subtitle={subtitle} />

        <HeroDescription text={description} />

        <HeroActions />

        <HeroSocials socials={socials} />
      </div>

      <Marquee items={skills} />
      {/* <Stats stats={stats} /> */}
    </section>
  );
}
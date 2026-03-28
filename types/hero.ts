

// /types/hero.ts
export type Stat = {
  num: string;
  label: string;
};

export type Social = {
  label: string;
  href: string;
};

export type HeroData = {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  skills: string[];
  stats: Stat[];
  socials: Social[];
};
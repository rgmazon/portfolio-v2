// /types/about.ts
export type Highlight = {
  num: string;
  label: string;
  desc: string;
};

export type AboutData = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  quote: string;
  author: string;
  highlights: Highlight[];
};
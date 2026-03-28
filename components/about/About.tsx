"use client";

import AboutHeader from "./AboutHeader";
import AboutContent from "./AboutContent";
import AboutQuote from "./AboutQuote";
import HighlightGrid from "./HighlightGrid";

import type { AboutData } from "@/types/about";

type Props = { data: AboutData };

export default function About({ data }: Props) {
  const { title, subtitle, paragraphs, quote, author, highlights } = data;

  return (
    <section id="about" className="bg-bg py-20 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        
        <AboutHeader />

        <div className="grid items-start gap-14 md:grid-cols-2 md:gap-20">
          
          {/* LEFT */}
          <div>
            <AboutContent
              title={title}
              subtitle={subtitle}
              paragraphs={paragraphs}
            />
            <AboutQuote quote={quote} author={author} />
          </div>

          {/* RIGHT */}
          <HighlightGrid items={highlights} />
        </div>
      </div>
    </section>
  );
}
"use client";

import { Experience } from "@/types/experience";

type Props = {
  exp: Experience;
  isOpen: boolean;
  onToggle: () => void;
};

export default function ExperienceItem({ exp, isOpen, onToggle }: Props) {
  return (
    <div className="border-b border-border first:border-t">
      <button
        onClick={onToggle}
        className={`w-full text-left flex items-center justify-between gap-4 px-4 py-5 lg:px-7 lg:py-6 transition-colors ${
          isOpen ? "bg-bg-surface" : "hover:bg-bg-surface"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-5 flex-1">
          {/* Role + Company */}
          <div className="flex-1">
            <span className="block font-display font-black uppercase text-cream text-base lg:text-lg">
              {exp.role}
            </span>
            <span className="text-sm text-muted">{exp.company}</span>
          </div>

          {/* Desktop meta */}
          <div className="hidden lg:flex flex-col items-end text-right gap-1">
            <span className="text-xs text-muted-dark tracking-wide">
              {exp.period}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-dark">
              {exp.type}
            </span>
          </div>
        </div>

        {/* Toggle icon */}
        <span
          className={`text-xl font-black transition-all ${
            isOpen ? "rotate-45 text-violet" : "text-muted-dark"
          }`}
        >
          +
        </span>
      </button>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-125" : "max-h-0"
        }`}
      >
        <div className="bg-bg-surface px-4 pb-6 lg:px-7 lg:pb-7">
          {/* Mobile meta */}
          <div className="lg:hidden flex gap-3 mb-4 text-xs text-muted-dark">
            <span>{exp.period}</span>
            <span className="uppercase tracking-widest">
              · {exp.type} · {exp.location}
            </span>
          </div>

          <p className="text-sm text-muted leading-relaxed mb-5">
            {exp.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {exp.stack.map((tech) => (
              <span
                key={tech}
                className="text-[11px] uppercase tracking-wider text-muted-dark bg-bg-darker px-2 py-1"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
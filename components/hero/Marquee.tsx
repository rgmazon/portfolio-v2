function Marquee({ items }: { items: string[] }) {
  return (
    <div className="bg-(--bg-darker) overflow-hidden h-12 flex items-center">
      <div className="flex w-max animate-[marquee_28s_linear_infinite]">
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2.5 px-7 h-12 font-bold text-[11px] tracking-[0.12em] uppercase text-(--muted-dark) whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-(--violet) shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
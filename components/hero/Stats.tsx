function Stats({ stats }: { stats: { num: string; label: string }[] }) {
  return (
    <div className="bg-(--bg-darker)">
      <div className="w-full max-w-300 mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="px-3 md:px-6 py-5 flex flex-col gap-1">
            <span className="font-black text-[24px] md:text-[28px] text-(--cream) leading-none">
              {s.num}
            </span>
            <span className="font-(--font-body) text-[10px] tracking-[0.08em] uppercase text-(--muted-dark)">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
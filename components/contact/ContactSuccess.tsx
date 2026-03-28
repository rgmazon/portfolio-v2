export default function ContactSuccess({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div className="bg-[--bg-surface] p-10 flex flex-col gap-4">
      <span className="font-(family-name:--font-display) font-black text-[28px] uppercase text-[--cream]">
        Message sent.
      </span>

      <p className="text-[14px] text-[--muted]">
        Thanks for reaching out. I'll get back to you shortly.
      </p>

      <button className="btn-ghost mt-2 self-start" onClick={onReset}>
        Send another
      </button>
    </div>
  );
}
export default function FooterBottom() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 py-6">
      <span className="text-[11px] tracking-[0.08em] uppercase text-muted-dark">
        © {new Date().getFullYear()} RG Mazon. All rights reserved.
      </span>

      <span className="text-[11px] tracking-[0.08em] uppercase text-muted-dark">
        Designed & Built by{" "}
        <span className="text-muted">RG Mazon</span>
      </span>
    </div>
  );
}
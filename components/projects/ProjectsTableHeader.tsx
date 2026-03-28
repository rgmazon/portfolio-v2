export default function ProjectsTableHeader() {
  const headers = ["#", "Project", "Stack", "GH", "URL"];

  return (
    <div className="hidden lg:grid grid-cols-[64px_1fr_160px_80px_80px] px-7 pb-3 gap-4">
      {headers.map((h) => (
        <span
          key={h}
          className="text-[10px] uppercase tracking-widest text-muted-dark"
        >
          {h}
        </span>
      ))}
    </div>
  );
}
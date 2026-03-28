"use client";

interface AdminToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}

export function AdminToggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: AdminToggleProps) {
  return (
    <div className="flex items-center justify-between border border-border bg-bg-darker px-4 py-3">
      <div>
        <p className="text-sm font-medium text-cream">{label}</p>
        {description && (
          <p className="mt-0.5 text-[11px] text-muted">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={
          "relative h-6 w-11 shrink-0 transition-colors duration-200 focus:outline-none " +
          "focus-visible:ring-1 focus-visible:ring-violet disabled:opacity-50 " +
          (checked ? "bg-violet" : "bg-bg border border-border")
        }
      >
        <span
          className={
            "absolute top-1 h-4 w-4 bg-cream transition-transform duration-200 " +
            (checked ? "translate-x-6" : "translate-x-1")
          }
        />
      </button>
    </div>
  );
}

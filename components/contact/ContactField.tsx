import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  label: string;
  placeholder: string;
  type?: string;
  textarea?: boolean;
  error?: string;
  registration: UseFormRegisterReturn;
};

export default function ContactField({
  label,
  placeholder,
  type = "text",
  textarea,
  error,
  registration,
}: Props) {
  const { name } = registration;

  const base =
    "w-full font-[family-name:var(--font-body)] text-[14px] text-[--cream] placeholder:text-[--muted-dark] px-4 py-4 outline-none border-none transition-colors duration-200 bg-[var(--bg-surface)] focus:bg-[var(--bg-darker)]";

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-[10px] uppercase text-[--muted-dark] tracking-widest"
      >
        {label}
      </label>

      {textarea ? (
        <textarea
          id={name}
          {...registration}
          placeholder={placeholder}
          rows={6}
          className={`${base} resize-y min-h-35`}
        />
      ) : (
        <input
          id={name}
          type={type}
          {...registration}
          placeholder={placeholder}
          className={base}
        />
      )}

      {error && (
        <span className="text-red-400 text-[12px]">{error}</span>
      )}
    </div>
  );
}
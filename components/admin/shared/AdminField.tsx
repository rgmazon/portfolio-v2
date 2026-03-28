"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import {
  UseFormRegisterReturn,
  FieldError,
} from "react-hook-form";

interface BaseFieldProps {
  label: string;
  hint?: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
}

type InputFieldProps = BaseFieldProps & {
  textarea?: false;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "className">;
};

type TextareaFieldProps = BaseFieldProps & {
  textarea: true;
  rows?: number;
  inputProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">;
};

type AdminFieldProps = InputFieldProps | TextareaFieldProps;

export function AdminField(props: AdminFieldProps) {
  const { label, hint, error, registration } = props;

  const sharedClass =
    "w-full bg-bg-darker border border-border text-cream text-sm px-4 py-3 " +
    "focus:outline-none focus:border-violet transition-colors duration-150 " +
    "placeholder:text-muted-dark";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] uppercase tracking-widest text-muted-dark">
        {label}
      </label>

      {props.textarea ? (
        <textarea
          rows={props.rows ?? 4}
          className={sharedClass + " resize-y"}
          {...registration}
          {...(props.inputProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={sharedClass}
          {...registration}
          {...(props.inputProps as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {hint && !error && (
        <span className="text-[11px] text-muted-dark">{hint}</span>
      )}
      {error && (
        <span className="text-[12px] text-red-400">{error.message}</span>
      )}
    </div>
  );
}

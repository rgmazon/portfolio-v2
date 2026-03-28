"use client";

import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export type SaveStatus = "idle" | "saving" | "success" | "error";

interface AdminSaveBarProps {
  status: SaveStatus;
  errorMessage?: string;
  onSave?: () => void;
  /** Pass true when using react-hook-form's handleSubmit via form's onSubmit */
  isFormSubmit?: boolean;
}

export function AdminSaveBar({
  status,
  errorMessage,
  onSave,
  isFormSubmit,
}: AdminSaveBarProps) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
      {/* Status feedback */}
      <div className="flex items-center gap-2 text-sm">
        {status === "saving" && (
          <>
            <Loader2 size={14} className="animate-spin text-muted" />
            <span className="text-muted">Saving…</span>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-emerald-400">Saved successfully</span>
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle size={14} className="text-red-400" />
            <span className="text-red-400">
              {errorMessage ?? "Failed to save"}
            </span>
          </>
        )}
      </div>

      <button
        type={isFormSubmit ? "submit" : "button"}
        onClick={!isFormSubmit ? onSave : undefined}
        disabled={status === "saving"}
        className="btn-fill disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

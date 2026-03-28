"use client";

import { useEffect, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Upload, Trash2, Copy, Check } from "lucide-react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BUCKET = "media";

type FileItem = {
  name: string;
  id: string;
  publicUrl: string;
  size?: number;
};

function formatBytes(bytes?: number) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaManager() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const { data, error: listError } = await supabase.storage
      .from(BUCKET)
      .list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

    if (listError) {
      setError(listError.message);
      setLoading(false);
      return;
    }

    const items: FileItem[] = (data ?? [])
      .filter((f) => f.name !== ".emptyFolderPlaceholder")
      .map((f) => {
        const { data: urlData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(f.name);
        return {
          name: f.name,
          id: f.id ?? f.name,
          publicUrl: urlData.publicUrl,
          size: f.metadata?.size,
        };
      });

    setFiles(items);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    setUploading(true);
    setError(null);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(safeName, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
    } else {
      await load();
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleDelete(name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    setDeleting(name);
    const { error: deleteError } = await supabase.storage
      .from(BUCKET)
      .remove([name]);
    if (deleteError) setError(deleteError.message);
    else await load();
    setDeleting(null);
  }

  async function handleCopy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  const isImage = (name: string) =>
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);

  return (
    <div>
      {/* Upload bar */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 btn-fill disabled:opacity-50"
        >
          <Upload size={13} />
          {uploading ? "Uploading…" : "Upload File"}
        </button>
        <span className="text-xs text-muted-dark">
          Images and videos stored in Supabase Storage bucket{" "}
          <code className="text-violet">{BUCKET}</code>
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-950 border border-red-800 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-dark py-8 text-center">Loading…</p>
      ) : files.length === 0 ? (
        <div className="border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-dark mb-4">No files uploaded yet.</p>
          <button
            onClick={() => inputRef.current?.click()}
            className="btn-fill"
          >
            Upload First File
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative border border-border bg-bg-darker overflow-hidden"
            >
              {/* Preview */}
              <div className="aspect-video bg-bg-surface flex items-center justify-center overflow-hidden">
                {isImage(file.name) ? (
                  <img
                    src={file.publicUrl}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <span className="text-[10px] uppercase tracking-widest text-muted-dark">
                    {file.name.split(".").pop()}
                  </span>
                )}
              </div>

              {/* Info + actions */}
              <div className="px-2 py-2">
                <p className="text-[11px] text-cream truncate mb-1">
                  {file.name}
                </p>
                <p className="text-[10px] text-muted-dark mb-2">
                  {formatBytes(file.size)}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleCopy(file.publicUrl)}
                    title="Copy public URL"
                    className="flex items-center gap-1 flex-1 justify-center px-2 py-1 text-[10px] uppercase tracking-wider border border-border hover:border-cream hover:text-cream text-muted transition-colors"
                  >
                    {copied === file.publicUrl ? (
                      <Check size={10} className="text-emerald-400" />
                    ) : (
                      <Copy size={10} />
                    )}
                    {copied === file.publicUrl ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => handleDelete(file.name)}
                    disabled={deleting === file.name}
                    title="Delete file"
                    className="px-2 py-1 border border-border hover:border-red-400 hover:text-red-400 text-muted transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

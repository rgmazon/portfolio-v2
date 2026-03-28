"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { GripVertical, Plus, Trash2, Upload } from "lucide-react";
import {
  projectSchema,
  ProjectFormValues,
} from "@/lib/validation/admin-settings";
import { AdminField } from "@/components/admin/shared/AdminField";
import { AdminSection } from "@/components/admin/shared/AdminSection";
import { AdminSaveBar, SaveStatus } from "@/components/admin/shared/AdminSaveBar";

type MediaItem = {
  type: "image" | "video";
  src: string;
  poster?: string;
};

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  /** Pass an existing project ID to edit, omit for create */
  id?: string;
};

export function ProjectForm({ id }: Props) {
  const router = useRouter();
  const isEdit = Boolean(id);

  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const dragIndex = useRef<number | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter((f) =>
      /^(image|video)\//i.test(f.type)
    );
    if (!arr.length) return;
    setUploadingFiles(true);
    const added: MediaItem[] = [];
    for (const file of arr) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(safeName, file, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("media")
          .getPublicUrl(safeName);
        const isVideo = file.type.startsWith("video/");
        added.push({ type: isVideo ? "video" : "image", src: urlData.publicUrl });
      }
    }
    setMedia((prev) => [...prev, ...added]);
    setUploadingFiles(false);
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      num: "",
      slug: "",
      title: "",
      category: "",
      year: new Date().getFullYear().toString(),
      role: "",
      type: "",
      description: "",
      stack: "",
      github: "",
      url: "",
      sort_order: 0,
    },
  });

  useEffect(() => {
    if (!id) return;
    async function load() {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        reset({
          ...data,
          stack: Array.isArray(data.stack) ? data.stack.join(", ") : data.stack ?? "",
          github: data.github ?? "",
          url: data.url ?? "",
        });
        if (Array.isArray(data.media)) setMedia(data.media);
      }
    }
    load();
  }, [id, reset]);

  async function onSubmit(values: ProjectFormValues) {
    setStatus("saving");
    setErrorMsg(undefined);

    const payload = {
      ...values,
      stack: values.stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      github: values.github || null,
      url: values.url || null,
      media: media.filter((m) => m.src.trim() !== ""),
      updated_at: new Date().toISOString(),
    };

    let error;

    if (isEdit) {
      ({ error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", id));
    } else {
      ({ error } = await supabase.from("projects").insert(payload));
    }

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("success");
      setTimeout(() => router.push("/admin/projects"), 1000);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <AdminSection title="Identity">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AdminField
            label="Number"
            hint='e.g. "001"'
            registration={register("num")}
            error={errors.num}
          />
          <AdminField
            label="Slug"
            hint='e.g. "my-project"'
            registration={register("slug")}
            error={errors.slug}
          />
          <AdminField
            label="Title"
            hint='e.g. "Arcflow"'
            registration={register("title")}
            error={errors.title}
          />
        </div>
      </AdminSection>

      <AdminSection title="Meta">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminField
            label="Category"
            hint='e.g. "SaaS / Dashboard"'
            registration={register("category")}
            error={errors.category}
          />
          <AdminField
            label="Year"
            hint='e.g. "2024"'
            registration={register("year")}
            error={errors.year}
          />
          <AdminField
            label="Your Role"
            hint='e.g. "Full-Stack Developer"'
            registration={register("role")}
            error={errors.role}
          />
          <AdminField
            label="Project Type"
            hint='e.g. "Personal Project", "Client"'
            registration={register("type")}
            error={errors.type}
          />
        </div>
      </AdminSection>

      <AdminSection title="Description">
        <AdminField
          label="Description"
          textarea
          rows={5}
          registration={register("description")}
          error={errors.description}
        />
      </AdminSection>

      <AdminSection
        title="Tech Stack"
        description="Comma-separated list of technologies."
      >
        <AdminField
          label="Stack"
          hint='e.g. "Next.js, TypeScript, Supabase"'
          registration={register("stack")}
          error={errors.stack}
        />
      </AdminSection>

      <AdminSection title="Links">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminField
            label="GitHub URL"
            hint="Leave blank if private"
            registration={register("github")}
            error={errors.github}
            inputProps={{ type: "url", placeholder: "https://github.com/…" }}
          />
          <AdminField
            label="Live URL"
            hint="Leave blank if not deployed"
            registration={register("url")}
            error={errors.url}
            inputProps={{ type: "url", placeholder: "https://…" }}
          />
        </div>
      </AdminSection>

      <AdminSection
        title="Order"
        description="Lower numbers appear first. Use 0 for the featured project."
      >
        <div className="w-32">
          <AdminField
            label="Sort Order"
            registration={register("sort_order", { valueAsNumber: true })}
            error={errors.sort_order}
            inputProps={{ type: "number", min: 0 }}
          />
        </div>
      </AdminSection>

      <AdminSection
        title="Media"
        description="Drag & drop images or videos to upload, or paste URLs manually."
      >
        <div className="flex flex-col gap-3">
          {/* Drop zone */}
          <div
            onDragEnter={(e) => { if (e.dataTransfer.types.includes("Files")) { e.preventDefault(); setDropActive(true); } }}
            onDragOver={(e) => { if (e.dataTransfer.types.includes("Files")) { e.preventDefault(); } }}
            onDragLeave={() => setDropActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDropActive(false);
              if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 border border-dashed py-8 cursor-pointer transition-colors ${
              dropActive ? "border-violet bg-violet/5" : "border-border hover:border-cream/40"
            }`}
          >
            <Upload size={18} className="text-muted-dark" />
            <p className="text-sm text-muted-dark">
              {uploadingFiles ? "Uploading…" : "Drop files here or click to browse"}
            </p>
            <p className="text-[11px] text-muted-dark/60">Images & videos — uploaded to Supabase Storage</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); e.target.value = ""; }}
          />
          {media.map((item, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => { dragIndex.current = i; }}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={(e) => {
                e.preventDefault();
                const from = dragIndex.current;
                if (from === null || from === i) return;
                const updated = [...media];
                const [moved] = updated.splice(from, 1);
                updated.splice(i, 0, moved);
                setMedia(updated);
                dragIndex.current = null;
              }}
              className="flex flex-col gap-2 p-4 border border-border bg-bg-darker cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-3">
                <GripVertical size={15} className="text-muted-dark shrink-0" />
                <select
                  value={item.type}
                  onChange={(e) => {
                    const updated = [...media];
                    updated[i] = { ...updated[i], type: e.target.value as "image" | "video" };
                    setMedia(updated);
                  }}
                  className="bg-bg-darker border border-border text-cream text-sm px-3 py-2 focus:outline-none focus:border-violet"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <input
                  type="url"
                  placeholder="https://… (src URL)"
                  value={item.src}
                  onChange={(e) => {
                    const updated = [...media];
                    updated[i] = { ...updated[i], src: e.target.value };
                    setMedia(updated);
                  }}
                  className="flex-1 bg-bg-darker border border-border text-cream text-sm px-4 py-2 focus:outline-none focus:border-violet placeholder:text-muted-dark cursor-text"
                />
                <button
                  type="button"
                  onClick={() => setMedia(media.filter((_, idx) => idx !== i))}
                  className="text-muted-dark hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              {item.type === "video" && (
                <input
                  type="url"
                  placeholder="https://… (poster image URL, optional)"
                  value={item.poster ?? ""}
                  onChange={(e) => {
                    const updated = [...media];
                    updated[i] = { ...updated[i], poster: e.target.value || undefined };
                    setMedia(updated);
                  }}
                  className="w-full bg-bg-darker border border-border text-cream text-sm px-4 py-2 focus:outline-none focus:border-violet placeholder:text-muted-dark cursor-text"
                />
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setMedia([...media, { type: "image", src: "" }])}
            className="flex items-center gap-2 text-sm text-muted-dark hover:text-cream transition-colors w-fit"
          >
            <Plus size={14} /> Add media item
          </button>
        </div>
      </AdminSection>

      <AdminSaveBar status={status} errorMessage={errorMsg} isFormSubmit />
    </form>
  );
}

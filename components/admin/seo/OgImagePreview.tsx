"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface OgImagePreviewProps {
  url: string;
}

export function OgImagePreview({ url }: OgImagePreviewProps) {
  if (!url) {
    return (
      <div className="flex h-36 w-full items-center justify-center border border-dashed border-border bg-bg-darker">
        <div className="flex flex-col items-center gap-2 text-muted-dark">
          <ImageIcon size={20} />
          <span className="text-[11px] uppercase tracking-widest">
            No image set
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-36 w-full overflow-hidden border border-border bg-bg-darker">
      <Image
        src={url}
        alt="OG image preview"
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  );
}

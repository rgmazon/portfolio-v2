"use client";

interface QuotePreviewProps {
  text: string;
}

export function QuotePreview({ text }: QuotePreviewProps) {
  return (
    <div className="border-l-2 border-violet bg-bg-darker px-5 py-4">
      <p className="text-sm italic text-cream-dim leading-relaxed">
        {text || (
          <span className="text-muted-dark">Your quote will appear here…</span>
        )}
      </p>
    </div>
  );
}

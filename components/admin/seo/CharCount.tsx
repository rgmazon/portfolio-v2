"use client";

interface CharCountProps {
  current: number;
  max: number;
}

export function CharCount({ current, max }: CharCountProps) {
  const isOver = current > max;
  const isWarning = current > max * 0.85;

  return (
    <span
      className={
        "text-[11px] tabular-nums " +
        (isOver
          ? "text-red-400"
          : isWarning
          ? "text-amber-400"
          : "text-muted-dark")
      }
    >
      {current}/{max}
    </span>
  );
}

import { useEffect, useState } from "react";
import type { BuddyState } from "../lib/states";
import { getAsciiFrame } from "../lib/ascii-sprites";

interface AsciiSpriteProps {
  state: BuddyState;
  direction: "left" | "right";
  species: string;
  eye?: string;
  hat?: string;
}

export function AsciiSprite({ state, direction, species, eye = "·", hat = "none" }: AsciiSpriteProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const speed = state === "dancing" ? 200 : 600;
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, speed);
    return () => clearInterval(interval);
  }, [state]);

  const lines = getAsciiFrame(state, tick, species, eye, hat);
  const isDancing = state === "dancing";

  return (
    <pre
      className={`select-none rounded-lg font-mono text-sm leading-tight text-amber-100 ${isDancing ? "animate-dance-ascii" : ""}`}
      style={{
        transform: direction === "left" ? "scaleX(-1)" : undefined,
        background: "rgba(30, 20, 15, 0.75)",
        padding: "8px 6px",
        backdropFilter: "blur(4px)",
      }}
    >
      {isDancing && "  ♪  ♫  ♪  \n"}
      {lines.join("\n")}
      {isDancing && "\n  ♫  ♪  ♫  "}
    </pre>
  );
}

import { useEffect, useState } from "react";
import type { BuddyState } from "../lib/states";
import { getAsciiFrame } from "../lib/ascii-sprites";

interface AsciiSpriteProps {
  state: BuddyState;
  direction: "left" | "right";
  species: string;
}

export function AsciiSprite({ state, direction, species }: AsciiSpriteProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const lines = getAsciiFrame(state, tick, species);

  return (
    <pre
      className="select-none rounded-lg font-mono text-sm leading-tight text-amber-100"
      style={{
        transform: direction === "left" ? "scaleX(-1)" : undefined,
        background: "rgba(30, 20, 15, 0.75)",
        padding: "8px 6px",
        backdropFilter: "blur(4px)",
      }}
    >
      {lines.join("\n")}
    </pre>
  );
}

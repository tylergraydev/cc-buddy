import { useState, useEffect, useRef } from "react";
import { listen } from "@tauri-apps/api/event";

export type SpriteStyle = "pixel" | "ascii";

export function useSpriteStyle() {
  const [style, setStyle] = useState<SpriteStyle>(
    () => (localStorage.getItem("buddy-sprite-style") as SpriteStyle) || "pixel",
  );

  const styleRef = useRef(style);
  styleRef.current = style;

  useEffect(() => {
    console.log("[buddy] Setting up toggle-style listener");
    const unlisten = listen("toggle-style", () => {
      const current = styleRef.current;
      const next = current === "pixel" ? "ascii" : "pixel";
      console.log(`[buddy] Toggle style: ${current} -> ${next}`);
      localStorage.setItem("buddy-sprite-style", next);
      setStyle(next);
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  return { style };
}

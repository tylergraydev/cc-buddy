import { useEffect, useRef, useState } from "react";
import { type BuddyState, pickNextState, randomDuration } from "../lib/states";
import { randomMessage } from "../lib/messages";

const WINDOW_W = 300;
const WINDOW_H = 400;
const SPRITE_SIZE = 64;
const BOUNDS_X = WINDOW_W - SPRITE_SIZE;
const BOUNDS_Y_MIN = 100; // leave top 100px for speech bubbles
const BOUNDS_Y_MAX = WINDOW_H - SPRITE_SIZE;

interface BuddyBehavior {
  state: BuddyState;
  position: { x: number; y: number };
  direction: "left" | "right";
  message: string | null;
}

export function useBuddyBehavior(): BuddyBehavior {
  const [state, setState] = useState<BuddyState>("idle");
  const [position, setPosition] = useState({ x: BOUNDS_X / 2, y: (BOUNDS_Y_MIN + BOUNDS_Y_MAX) / 2 });
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef<BuddyState>("idle");

  useEffect(() => {
    function scheduleNext() {
      if (timerRef.current) clearTimeout(timerRef.current);

      const duration = randomDuration(stateRef.current);
      timerRef.current = setTimeout(() => {
        const next = pickNextState(stateRef.current);
        stateRef.current = next;
        setState(next);

        if (next === "walking") {
          const targetX = Math.random() * BOUNDS_X;
          const targetY = BOUNDS_Y_MIN + Math.random() * (BOUNDS_Y_MAX - BOUNDS_Y_MIN);
          setPosition((prev) => {
            setDirection(targetX > prev.x ? "right" : "left");
            return { x: targetX, y: targetY };
          });
        }

        if (next === "talking") {
          setMessage(randomMessage());
        } else {
          setMessage(null);
        }

        scheduleNext();
      }, duration);
    }

    scheduleNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { state, position, direction, message };
}

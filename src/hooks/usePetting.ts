import { useCallback, useRef, useState } from "react";

export function usePetting() {
  const [isPetting, setIsPetting] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const heartIdRef = useRef(0);
  const moveCountRef = useRef(0);
  const isDownRef = useRef(false);
  const petTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onPetStart = useCallback((e: React.MouseEvent) => {
    // Only left click
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    isDownRef.current = true;
    moveCountRef.current = 0;
  }, []);

  const onPetMove = useCallback((e: React.MouseEvent) => {
    if (!isDownRef.current) return;
    moveCountRef.current++;

    // After a few mouse moves while held, it's a pet
    if (moveCountRef.current >= 3 && !isPetting) {
      setIsPetting(true);
    }

    // Spawn hearts while petting
    if (moveCountRef.current >= 3 && moveCountRef.current % 4 === 0) {
      const id = heartIdRef.current++;
      const x = e.nativeEvent.offsetX + (Math.random() - 0.5) * 20;
      const y = e.nativeEvent.offsetY - 10;
      setHearts((prev) => [...prev, { id, x, y }]);

      // Remove heart after animation
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, 1000);
    }
  }, [isPetting]);

  const onPetEnd = useCallback(() => {
    isDownRef.current = false;

    if (isPetting) {
      // Keep petting state briefly so the buddy can react
      if (petTimeoutRef.current) clearTimeout(petTimeoutRef.current);
      petTimeoutRef.current = setTimeout(() => {
        setIsPetting(false);
      }, 800);
    }

    moveCountRef.current = 0;
  }, [isPetting]);

  return { isPetting, hearts, onPetStart, onPetMove, onPetEnd };
}

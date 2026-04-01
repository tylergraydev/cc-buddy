import { useCallback, useRef, useState } from "react";

export function usePetting() {
  const [isPetting, setIsPetting] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const moveCountRef = useRef(0);
  const isDownRef = useRef(false);
  const heartFiredRef = useRef(false);
  const petTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onPetStart = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    isDownRef.current = true;
    moveCountRef.current = 0;
    heartFiredRef.current = false;
  }, []);

  const onPetMove = useCallback(() => {
    if (!isDownRef.current) return;
    moveCountRef.current++;

    // After a few moves, it's a pet
    if (moveCountRef.current >= 3 && !isPetting) {
      setIsPetting(true);
    }

    // After sustained petting (~15 moves), show a single heart burst
    if (moveCountRef.current >= 15 && !heartFiredRef.current) {
      heartFiredRef.current = true;
      setShowHeart(true);

      if (heartTimeoutRef.current) clearTimeout(heartTimeoutRef.current);
      heartTimeoutRef.current = setTimeout(() => {
        setShowHeart(false);
      }, 1500);
    }
  }, [isPetting]);

  const onPetEnd = useCallback(() => {
    isDownRef.current = false;
    moveCountRef.current = 0;

    if (isPetting) {
      if (petTimeoutRef.current) clearTimeout(petTimeoutRef.current);
      petTimeoutRef.current = setTimeout(() => {
        setIsPetting(false);
      }, 800);
    }
  }, [isPetting]);

  return { isPetting, showHeart, onPetStart, onPetMove, onPetEnd };
}

import { getCurrentWindow } from "@tauri-apps/api/window";
import { useCallback } from "react";

export function useDragWindow() {
  return useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      getCurrentWindow().startDragging();
    }
  }, []);
}

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export interface BuddyConfig {
  species: string;
  eye: string;
  hat: string;
  rarity: string;
  shiny: boolean;
  name: string;
}

const DEFAULT_CONFIG: BuddyConfig = {
  species: "capybara",
  eye: "·",
  hat: "none",
  rarity: "common",
  shiny: false,
  name: "Buddy",
};

export function useBuddyConfig() {
  const [config, setConfig] = useState<BuddyConfig>(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    invoke<BuddyConfig>("get_buddy_config")
      .then((cfg) => {
        console.log("[buddy] Config loaded:", cfg);
        setConfig(cfg);
        setLoaded(true);
      })
      .catch((err) => {
        console.warn("[buddy] Failed to load config, using defaults:", err);
        setLoaded(true);
      });
  }, []);

  return { config, loaded };
}

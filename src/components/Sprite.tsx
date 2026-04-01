import type { BuddyState } from "../lib/states";

interface SpriteProps {
  state: BuddyState;
  direction: "left" | "right";
  species: string;
}

const ANIM_CLASS: Record<BuddyState, string> = {
  idle: "sprite-idle",
  walking: "sprite-walk",
  sitting: "sprite-sit",
  looking: "sprite-look",
  talking: "sprite-idle",
  dancing: "sprite-dance",
};

const SPRITE_FILE: Record<string, string> = {
  "sprite-idle": "idle",
  "sprite-walk": "walk",
  "sprite-sit": "sit",
  "sprite-look": "look",
  "sprite-dance": "idle",
};

export function Sprite({ state, direction, species }: SpriteProps) {
  const anim = ANIM_CLASS[state];
  const file = SPRITE_FILE[anim];
  const basePath = `/sprites/${species}`;

  return (
    <div
      className={`sprite ${anim}`}
      style={{
        backgroundImage: `url('${basePath}/${file}.png')`,
        transform: direction === "left" ? "scaleX(-1)" : undefined,
      }}
    />
  );
}

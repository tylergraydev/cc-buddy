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
};

export function Sprite({ state, direction, species }: SpriteProps) {
  const anim = ANIM_CLASS[state];
  const basePath = `/sprites/${species}`;

  return (
    <div
      className={`sprite ${anim}`}
      style={{
        transform: direction === "left" ? "scaleX(-1)" : undefined,
        backgroundImage: `url('${basePath}/${anim === "sprite-idle" ? "idle" : anim === "sprite-walk" ? "walk" : anim === "sprite-sit" ? "sit" : "look"}.png')`,
      }}
    />
  );
}

import { useState } from "react";
import { useBuddyBehavior } from "../hooks/useBuddyBehavior";
import { useBuddyConfig } from "../hooks/useBuddyConfig";
import { useDragWindow } from "../hooks/useDragWindow";
import { useSpriteStyle } from "../hooks/useSpriteStyle";
import { randomMessage } from "../lib/messages";
import { SPECIES_LIST } from "../lib/ascii-sprites";
import { AsciiSprite } from "./AsciiSprite";
import { SpeechBubble } from "./SpeechBubble";
import { Sprite } from "./Sprite";

export function Buddy() {
  const { state, position, direction, message } = useBuddyBehavior();
  const { config } = useBuddyConfig();
  const [clickMessage, setClickMessage] = useState<string | null>(null);
  const [debugSpeciesIdx, setDebugSpeciesIdx] = useState<number | null>(null);
  const onMouseDown = useDragWindow();
  const { style } = useSpriteStyle();

  const isDev = import.meta.env.DEV;
  const species = debugSpeciesIdx !== null
    ? SPECIES_LIST[debugSpeciesIdx]
    : config.species;

  return (
    <div className="relative h-[400px] w-[300px]" onMouseDown={onMouseDown}>
      <div
        className="absolute transition-all duration-1000 ease-linear"
        style={{ left: position.x, top: position.y }}
        onClick={(e) => {
          e.stopPropagation();
          setClickMessage(clickMessage ? null : randomMessage());
        }}
        onContextMenu={isDev ? (e) => {
          e.preventDefault();
          e.stopPropagation();
          setDebugSpeciesIdx((i) => {
            const next = ((i ?? SPECIES_LIST.indexOf(config.species)) + 1) % SPECIES_LIST.length;
            setClickMessage(SPECIES_LIST[next]);
            return next;
          });
        } : undefined}
      >
        {(message || clickMessage) && (
          <SpeechBubble
            message={message || clickMessage!}
            parentX={position.x}
          />
        )}
        {style === "pixel" ? (
          <Sprite state={state} direction={direction} species={species} />
        ) : (
          <AsciiSprite
            state={state}
            direction={direction}
            species={species}
            eye={config.eye}
            hat={config.hat}
          />
        )}
      </div>
    </div>
  );
}

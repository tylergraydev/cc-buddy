import { useState } from "react";
import { useBuddyBehavior } from "../hooks/useBuddyBehavior";
import { useDragWindow } from "../hooks/useDragWindow";
import { useSpriteStyle } from "../hooks/useSpriteStyle";
import { randomMessage } from "../lib/messages";
import { SPECIES_LIST } from "../lib/ascii-sprites";
import { AsciiSprite } from "./AsciiSprite";
import { SpeechBubble } from "./SpeechBubble";
import { Sprite } from "./Sprite";

export function Buddy() {
  const { state, position, direction, message } = useBuddyBehavior();
  const [clickMessage, setClickMessage] = useState<string | null>(null);
  const [speciesIdx, setSpeciesIdx] = useState(
    SPECIES_LIST.indexOf("capybara"),
  );
  const onMouseDown = useDragWindow();
  const { style } = useSpriteStyle();

  const species = SPECIES_LIST[speciesIdx];

  return (
    <div className="relative h-[400px] w-[300px]" onMouseDown={onMouseDown}>
<div
        className="absolute transition-all duration-1000 ease-linear"
        style={{ left: position.x, top: position.y }}
        onClick={(e) => {
          e.stopPropagation();
          setClickMessage(clickMessage ? null : randomMessage());
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setSpeciesIdx((i) => (i + 1) % SPECIES_LIST.length);
          setClickMessage(SPECIES_LIST[(speciesIdx + 1) % SPECIES_LIST.length]);
        }}
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
          />
        )}
      </div>
    </div>
  );
}

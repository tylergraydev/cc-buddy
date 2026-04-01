import { useState } from "react";
import { useBuddyBehavior } from "../hooks/useBuddyBehavior";
import { useBuddyConfig } from "../hooks/useBuddyConfig";
import { useDragWindow } from "../hooks/useDragWindow";
import { usePetting } from "../hooks/usePetting";
import { useSpriteStyle } from "../hooks/useSpriteStyle";
import { randomMessage } from "../lib/messages";
import { SPECIES_LIST } from "../lib/ascii-sprites";
import { AsciiSprite } from "./AsciiSprite";
import { Hearts } from "./Hearts";
import { SpeechBubble } from "./SpeechBubble";
import { Sprite } from "./Sprite";

const PET_MESSAGES = [
  "❤️",
  "That feels nice!",
  "*purrs*",
  "*happy noises*",
  "More pets please!",
  "˶ᵔ ᵕ ᵔ˶",
  "*nuzzle*",
  "Don't stop!",
];

function randomPetMessage(): string {
  return PET_MESSAGES[Math.floor(Math.random() * PET_MESSAGES.length)];
}

export function Buddy() {
  const { state, position, direction, message } = useBuddyBehavior();
  const { config } = useBuddyConfig();
  const [clickMessage, setClickMessage] = useState<string | null>(null);
  const [debugSpeciesIdx, setDebugSpeciesIdx] = useState<number | null>(null);
  const onDragMouseDown = useDragWindow();
  const { isPetting, hearts, onPetStart, onPetMove, onPetEnd } = usePetting();
  const { style } = useSpriteStyle();

  const isDev = import.meta.env.DEV;
  const species =
    debugSpeciesIdx !== null ? SPECIES_LIST[debugSpeciesIdx] : config.species;

  // Show pet message when petting starts
  const displayMessage = isPetting
    ? randomPetMessage()
    : message || clickMessage;

  return (
    <div
      className="relative h-[400px] w-[300px]"
      onMouseDown={onDragMouseDown}
    >
      <div
        className="absolute transition-all duration-1000 ease-linear"
        style={{ left: position.x, top: position.y }}
      >
        {displayMessage && (
          <SpeechBubble message={displayMessage} parentX={position.x} />
        )}
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            onPetStart(e);
          }}
          onMouseMove={onPetMove}
          onMouseUp={() => {
            onPetEnd();
            // If it wasn't a pet gesture, treat as click
            if (!isPetting) {
              setClickMessage(clickMessage ? null : randomMessage());
            }
          }}
          onMouseLeave={onPetEnd}
          onContextMenu={
            isDev
              ? (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDebugSpeciesIdx((i) => {
                    const next =
                      ((i ?? SPECIES_LIST.indexOf(config.species)) + 1) %
                      SPECIES_LIST.length;
                    setClickMessage(SPECIES_LIST[next]);
                    return next;
                  });
                }
              : undefined
          }
          style={{ cursor: isPetting ? "grabbing" : "pointer" }}
          className={isPetting ? "animate-wiggle" : ""}
        >
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
        <Hearts hearts={hearts} />
      </div>
    </div>
  );
}

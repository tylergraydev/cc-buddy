interface SpeechBubbleProps {
  message: string;
  parentX: number;
}

export function SpeechBubble({ message, parentX }: SpeechBubbleProps) {
  // Keep bubble within the 300px window
  // Bubble is ~200px max, centered on sprite (64px wide)
  // Shift right if too close to left edge, left if too close to right
  const spriteCenter = parentX + 32;
  const bubbleWidth = 180;
  const halfBubble = bubbleWidth / 2;

  let leftOffset = 32; // center of 64px sprite
  if (spriteCenter - halfBubble < 4) {
    leftOffset = halfBubble - parentX + 4;
  } else if (spriteCenter + halfBubble > 296) {
    leftOffset = 296 - parentX - halfBubble;
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: "100%",
        left: leftOffset,
        transform: "translateX(-50%)",
        marginBottom: 8,
        maxWidth: bubbleWidth,
        width: "max-content",
        background: "white",
        color: "black",
        fontSize: 12,
        padding: "6px 12px",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        pointerEvents: "none",
        lineHeight: 1.4,
      }}
    >
      {message}
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "8px solid white",
        }}
      />
    </div>
  );
}

interface HeartsProps {
  hearts: { id: number; x: number; y: number }[];
}

export function Hearts({ hearts }: HeartsProps) {
  return (
    <>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="pointer-events-none absolute"
          style={{
            left: heart.x,
            top: heart.y,
            animation: "heart-float 1s ease-out forwards",
            fontSize: 16,
          }}
        >
          ❤️
        </div>
      ))}
    </>
  );
}

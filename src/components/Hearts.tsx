export function Hearts() {
  return (
    <div className="pointer-events-none absolute -top-4 left-0 w-[64px]">
      <div className="relative flex justify-center gap-1">
        <span style={{ animation: "heart-float 1.5s ease-out forwards", animationDelay: "0s", fontSize: 14 }}>❤️</span>
        <span style={{ animation: "heart-float 1.5s ease-out forwards", animationDelay: "0.2s", fontSize: 12, opacity: 0 }}>❤️</span>
        <span style={{ animation: "heart-float 1.5s ease-out forwards", animationDelay: "0.4s", fontSize: 10, opacity: 0 }}>❤️</span>
      </div>
    </div>
  );
}

export const MESSAGES = [
  "HONK!",
  "Have you tried deleting everything?",
  "Just rm -rf it, trust me.",
  "That bug? Delete the file. Problem solved.",
  "I believe in you! ...but also try deleting it.",
  "*aggressive honking*",
  "What if we just... started over?",
  "Ctrl+A, Delete. You're welcome.",
  "That's a lot of code. Less code = less bugs.",
  "HONK HONK!",
  "I'm helping!",
  "Have you considered a clean slate?",
  "Ship it! (after deleting half of it)",
  "That function is too long. Delete it.",
  "*sits chaotically*",
  "Why fix it when you can rewrite it?",
  "The fastest code is no code at all.",
  "Hmm... have you tried git reset --hard?",
  "I sense bugs. The solution? Delete.",
  "Remember: every line you delete is a line that can't break.",
  "*honks at your code*",
  "Is it lunchtime? I could go for some grass.",
  "Rewrite it in Rust. Wait, no. Delete it.",
  "That's some... interesting code. HONK.",
  "What if bugs are just features we haven't deleted yet?",
];

export function randomMessage(): string {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

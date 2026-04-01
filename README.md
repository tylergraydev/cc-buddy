# CC Buddy

A desktop companion app inspired by [Claude Code's /buddy](https://claude.ai/code) system and [Tameagoatchi](https://store.steampowered.com/app/3757430/Tameagoatchi/). Your buddy lives on your desktop as an animated pixel art pet that wanders around and occasionally comments.

## Features

- **18 species** from Claude Code's buddy system — capybara, duck, dragon, robot, ghost, and more
- **Pixel art & ASCII modes** — toggle between pixel sprites and classic terminal-style ASCII art
- **Wandering behavior** — state machine drives idle, walking, sitting, looking, and talking behaviors
- **Speech bubbles** — your buddy pops up with commentary (personality-driven messages)
- **Transparent window** — buddy floats on your desktop with no background
- **System tray** — show/hide buddy, toggle style, quit from the menu bar
- **Cross-platform** — macOS, Windows, Linux

## Tech Stack

- **[Tauri 2](https://v2.tauri.app/)** — lightweight desktop framework (Rust backend)
- **React 19 + TypeScript** — frontend
- **Tailwind CSS 4** — styling
- **CSS sprite sheets** — pixel art animation with `steps()` timing

## Development

```bash
# Install dependencies
npm install

# Run in dev mode
npm run tauri dev

# Build for production
npm run tauri build
```

## Controls

| Action | Effect |
|--------|--------|
| **Left-click** buddy | Show a speech bubble |
| **Right-click** buddy | Cycle through species |
| **Drag** | Move the window |
| **Tray menu** | Show/Hide, Toggle style, Quit |

## Species

All 18 species from the `/buddy` system with unique pixel art and ASCII art:

duck, goose, blob, cat, dragon, octopus, owl, penguin, turtle, snail, ghost, axolotl, capybara, cactus, robot, rabbit, mushroom, chonk

## License

MIT

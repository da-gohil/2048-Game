# 🎮 2048 - A Fun JavaScript Experiment

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A classic **2048** puzzle game built from scratch using **HTML**, **CSS**, and **vanilla JavaScript** — no frameworks, no libraries, just the fundamentals.

This started as a hands-on way to learn JavaScript and explore game logic, DOM manipulation, and event handling. It turned into a genuinely enjoyable experiment.

---

## 🚀 Demo
- 🕹️ **Play it live:** [Try it here](https://da-gohil.github.io/2048-Game/)
- 📺 **Video walkthrough:** [YouTube Demo](https://www.youtube.com/@iDarshanGohil/playlists)

## 👀 At a Glance

<img width="539" alt="2048 game screenshot" src="https://github.com/user-attachments/assets/11caa72f-d6c4-4ebc-8821-c9cfed2cb151" />

---

## ✨ Features

- 🎯 Fully playable 2048 with **smooth sliding tile animations** — tiles glide and merge (FLIP technique, capped at **100ms** so it stays fast)
- 🌗 **Light / Dark mode toggle** — a clean, colorful light theme and a **neon arcade** dark theme (glowing tiles), with the choice persisted and an OS-preference fallback
- 🎨 **Modern design system** — system font stack (the clean sans Apple & Uber use), vibrant tile spectrum, subtle paper-grain texture, soft shadows, rounded corners
- 🏆 Score tracking with current **and** best score (persisted via `localStorage`)
- ⌨️ Keyboard arrow keys **and** swipe support — swipes fire **mid-gesture** (the instant the threshold is crossed) so it feels instant, not laggy
- 📱 Mobile-first: the screen stays **completely static** while swiping (no page scroll, bounce, pull-to-refresh, zoom, or tap-highlight)
- 🔄 **"New Game"** button to restart anytime
- ♿ Respects `prefers-reduced-motion` for accessibility
- 🚀 Zero dependencies, zero build step — pure HTML/CSS/JS, deployable straight to GitHub Pages

---

## 🕹️ How to Play

- Use the **arrow keys** (↑ ↓ ← →) or **swipe** on a touch device to move the tiles
- When two tiles with the same number touch, they **merge into one** and their values add up
- Reach the **2048 tile** to win — but keep playing to beat your high score!
- Tap the **sun / moon button** (top-right) to switch between light and the neon dark theme

---

## 🎨 Design & Architecture

A lot of the polish lives under the hood:

- **Theming** — all colors are CSS custom properties (`--bg`, `--accent`, `--tile-*`, …). Dark mode just overrides them on `[data-theme="dark"]`, so a single token swap repaints the whole game. The choice is saved to `localStorage` and falls back to the OS `prefers-color-scheme`.
- **Two-tone tiles** — the light theme runs a vibrant cool→warm spectrum; the dark theme is a neon arcade look (dark tiles with a glowing outline + number). Each tile exposes its color as a `--c` variable so dark mode reuses that one value for the fill-glow, border, and text-glow — no duplicated rules.
- **Sliding animation (FLIP)** — the board is a real tile model (each tile is its own element with identity) rendered on a `.tiles` layer above a static `.cells` grid. On a move it measures positions → re-places tiles → inverts with `transform` → plays to the new spot, transitioning over **100ms**. An `isAnimating` lock keeps fast swipes from desyncing the board.
- **Static-screen mobile UX** — `overflow:hidden`, `overscroll-behavior:none`, `touch-action:none`, a non-passive `touchmove` `preventDefault`, and a locked viewport stop all page panning, bounce, and zoom so only the game responds.
- **Paper finish** — a subtle inline-SVG `feTurbulence` grain layered on the background (no image files).

---

## 📂 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/2048-game.git
   cd 2048-game
   ```

2. **Open the game**
   Just open `index.html` in your browser. No build step, no dependencies — that's the beauty of vanilla JS.

   ```bash
   # macOS
   open index.html

   # Linux
   xdg-open index.html

   # Windows
   start index.html
   ```

---

## 🧠 What I Learned
While building this, I practised:
- **JavaScript fundamentals** — arrays, objects, functions, event handling
- **DOM manipulation** and updating the UI dynamically
- **Game loop logic** — move, merge, spawn, check game-over conditions
- **FLIP animations** — measuring layout and animating with `transform` for smooth 60fps slides
- **CSS custom properties** to build a token-driven, themeable design system (light + dark)
- **Keyboard and touch events** across platforms, including mobile gesture handling and locking page scroll
- **`localStorage`** to persist the best score and theme preference across sessions
- **Project structure** — keeping code clean and readable in a small codebase

---

## 🤝 Suggestions & Contributions

This was a learning project, and I'd love to hear ideas for improvements, new features, or code-quality tweaks.
If you have something in mind:

- 🐛 [Open an issue](../../issues) to discuss a suggestion or report a bug
- 🔧 Fork the repo and submit a pull request with your improvements

All contributions are welcome — features, better animations, accessibility improvements, anything.

### 💡 Ideas on the Roadmap

- [x] Dark mode toggle (neon arcade theme)
- [x] Smooth sliding tile + merge animations
- [x] Best-score persistence and mobile swipe support
- [ ] Undo move
- [ ] Sound effects
- [ ] Different grid sizes (3×3, 5×5)
- [ ] Continue playing after reaching 2048

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE). Feel free to use, modify, and share it.

---

<p align="center">
  Made with ❤️ as a learning adventure in JavaScript!<br>
</p>

# 🎮 2048 - A Fun JavaScript Experiment

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A classic **2048** puzzle game built from scratch using **HTML**, **CSS**, and **vanilla JavaScript** — no frameworks, no libraries, just the fundamentals.

This started as a hands-on way to learn JavaScript and explore game logic, DOM manipulation, and event handling. It turned into a genuinely enjoyable experiment.

---

## 🚀 Demo

- 📺 **Video walkthrough:** [YouTube Demo](https://www.youtube.com/@iDarshanGohil/playlists)
- 🕹️ **Play it live:** [Try it here](#) <!-- TODO: add deployed link -->

## 👀 At a Glance

<img width="539" alt="2048 game screenshot" src="https://github.com/user-attachments/assets/11caa72f-d6c4-4ebc-8821-c9cfed2cb151" />

---

## ✨ Features

- 🎯 Fully playable 2048 game with smooth tile animations
- 🏆 Score tracking with current and best score (persisted via `localStorage`)
- 📱 Responsive design works on desktop and mobile touchscreens
- ⌨️ Keyboard arrow keys **and** swipe support for mobile
- 🔄 **"New Game"** button to restart anytime
- 🎨 Clean, minimalist UI styled with pure CSS

---

## 🕹️ How to Play

- Use the **arrow keys** (↑ ↓ ← →) or **swipe** on a touch device to move the tiles
- When two tiles with the same number touch, they **merge into one** and their values add up
- Reach the **2048 tile** to win — but keep playing to beat your high score!

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
- **Keyboard and touch events** across platforms
- **`localStorage`** to persist the best score across sessions
- **Project structure** — keeping code clean and readable in a small codebase

---

## 🤝 Suggestions & Contributions

This was a learning project, and I'd love to hear ideas for improvements, new features, or code-quality tweaks.
If you have something in mind:

- 🐛 [Open an issue](../../issues) to discuss a suggestion or report a bug
- 🔧 Fork the repo and submit a pull request with your improvements

All contributions are welcome — features, better animations, accessibility improvements, anything.

### 💡 Ideas on the Roadmap

- [ ] Undo move
- [ ] Dark mode toggle
- [ ] Score animation when tiles merge
- [ ] Sound effects
- [ ] Different grid sizes (3×3, 5×5)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE). Feel free to use, modify, and share it.

---

<p align="center">
  Made with ❤️ as a learning adventure in JavaScript!<br>
</p>

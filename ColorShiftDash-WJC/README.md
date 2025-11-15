# Color Shift Dash

An endless arcade game with a futuristic 2025 space theme where you control a fixed avatar at the bottom of the screen and must match its color with space meteors (orbs) descending from above. Features progressive difficulty, a 3-life system with life regain, epic Star Wars-style background music, and stunning neon visual effects.

## How to Play

1. Use arrow keys to change your avatar's color:
   - **↑ (UP)** → Red
   - **→ (RIGHT)** → Blue
   - **↓ (DOWN)** → Yellow
   - **← (LEFT)** → Green

2. Match your color with the incoming space meteors to score points!

3. Mismatch costs you a life. You start with 3 lives.

4. **Life Regain System:** After losing a life, you can regain it by scoring 5 successful hits in a row (maximum 3 lives).

5. **Difficulty Progression:**
   - **Learning Phase (0-5 points):** Slow, constant speed - perfect for learning
   - **After Learning Phase:** Speed and spawn rate gradually increase
   - **All 4 colors** (Red, Blue, Yellow, Green) are active from the start
   - Speed increases based on score and time (capped at 25 pixels/frame)

## Audio Files

The game uses real audio files (WAV format) located in `assets/audio/`:

- **hit.wav** - Success sound when matching colors
- **miss.wav** - Error sound when colors don't match
- **change.wav** - Sound when changing avatar color
- **music.wav** - Epic Star Wars-style background music (60s loop)

**Note:** If audio files are missing or fail to load, the game will automatically generate them procedurally using Web Audio API. The background music plays during gameplay and stops automatically when the game ends.

## Running the Game

**Note:** This game uses ES6 modules, so it needs to be served from a web server (not opened directly from the file system).

### Option 1: Using Python (Recommended)

If you have Python installed:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 2: Using Node.js

If you have Node.js installed:

```bash
npx http-server -p 8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 3: Using VS Code Live Server

If you're using VS Code, install the "Live Server" extension and right-click on `index.html` → "Open with Live Server"

## Features

- **Futuristic 2025 Design:** Neon aesthetics with glassmorphism UI elements
- **Space Theme:** Pure black backgrounds with animated stars, space meteors as enemies
- **Responsive 16:9 Canvas:** Scales perfectly on any desktop screen
- **Progressive Difficulty:** Learning phase (first 5 points) + gradual increase
- **3-Life System:** With life regain mechanic (1 life every 5 hits after losing one)
- **Visual Effects:**
  - Multi-layer particle explosions for matches and misses
  - Camera shake on miss
  - Energy glows and trails on all objects
  - Neon shadows and glows throughout UI
- **Audio System:**
  - Real WAV audio files with procedural fallback
  - Epic Star Wars-style background music
  - Sound effects for all interactions
- **High Score Persistence:** Saved in browser localStorage
- **Smooth 60 FPS Gameplay:** Optimized for performance

## Controls

- **Arrow Keys**: Change avatar color
- **SPACE**: Start game / Restart
- **ESC**: Return to menu (from game over)
- **R**: Reset high score (from game over)

## Technical Details

- **Framework**: Phaser 3.80.0 (via CDN)
- **Language**: JavaScript (ES6 Modules)
- **Canvas**: Responsive 16:9 aspect ratio (1024x576 base resolution)
- **Audio**: WAV files from `assets/audio/` folder, with Web Audio API procedural fallback
- **Storage**: LocalStorage for high score persistence
- **Design**: Futuristic 2025 aesthetic with neon effects, glassmorphism, and space theme
- **Visual Effects**: Multi-layer particle systems, blend modes (ADD), animated glows
- **Performance**: Optimized for 60 FPS on Chrome desktop

## Developer

WJC

---

Enjoy the game!


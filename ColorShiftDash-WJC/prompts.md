# Prompts Used - Color Shift Dash

This document contains the prompts and development process for creating Color Shift Dash.

## Game Concept

Color Shift Dash is an endless arcade game where the player controls a fixed avatar in the center of the screen and must match its color with the color of objects (orbs) coming towards them. The game features progressive difficulty, a 3-life system, particles, effects, and sounds.

## Development Process

### Initial Planning

**Prompt 1:** Understanding the requirements from the PRD document and creating a development plan.

The game was developed using Phaser 3.80.0 via CDN, with a modular architecture to facilitate development in Cursor. The canvas is responsive with a 16:9 aspect ratio, and all audio is generated procedurally using Web Audio API.

### Architecture Decisions

**Key Decisions:**
1. **Modular Structure:** Split into multiple files:
   - Scenes: BootScene, MenuScene, GameScene, GameOverScene
   - Objects: Avatar, Orb
   - Utils: ColorManager, DifficultyManager

2. **Audio System:** 
   - Supports real audio files (WAV/MP3) from `assets/audio/` folder
   - Automatic procedural fallback if files are missing
   - Star Wars-style epic background music (60s loop)
   - Sound effects for hit, miss, and color change
   - Background music plays during gameplay and stops on game over

3. **Color System:** Uses a ColorManager to handle active colors and color changes based on arrow keys:
   - ↑ (UP) → Red
   - → (RIGHT) → Blue
   - ↓ (DOWN) → Yellow
   - ← (LEFT) → Green

4. **Difficulty Progression:**
   - Learning phase (0-5 points): Constant slow speed, 4 colors active
   - After learning phase: Gradual speed increase based on score and time
   - Speed cap: Maximum 25 pixels/frame
   - Spawn interval decreases gradually (minimum ~1500ms)
   - Always 4 colors active from the start

5. **Life System:**
   - Start with 3 lives (hearts)
   - Lose 1 life on color mismatch
   - Gain life back: After losing a life, regain 1 life every 5 successful hits
   - Maximum lives always capped at 3
   - Visual feedback when life is regained

6. **Visual Design (Futuristic 2025):**
   - Space-themed backgrounds (pure black with animated stars)
   - Neon aesthetics with glowing effects (cyan, magenta, yellow, green)
   - Glassmorphism UI elements (semi-transparent backgrounds with neon borders)
   - Multi-layer particle effects with blend modes
   - Avatar and orbs designed as space objects (meteors/asteroids with energy glows)
   - Animated energy trails and sparks

### Implementation Challenges

**Challenge 1: Audio System**
- **Issue:** Need to support real audio files while maintaining fallback.
- **Solution:** 
  - Implemented dual system: tries to load WAV/MP3 files from `assets/audio/` first
  - Automatic procedural generation fallback if files don't exist or fail to decode
  - Created Python script to generate proper WAV files
  - Background music (Star Wars style) plays in loop during gameplay
  - Music stops automatically when game ends

**Challenge 2: Responsive Canvas**
- **Issue:** Maintaining 16:9 aspect ratio while being responsive.
- **Solution:** Used Phaser's Scale.FIT mode with fixed dimensions (1024x576) and proper min/max constraints, allowing the game to scale appropriately while maintaining aspect ratio.

**Challenge 3: Orb Spawning and Movement**
- **Issue:** Orbs need appropriate anticipation time and space-like appearance.
- **Solution:** 
  - Changed to spawn only from top of screen with 100px offset for anticipation
  - Orbs designed as space objects (meteors/asteroids) with energy glows
  - Added rotation animations and energy trails
  - Multi-layer visual effects (aura, glow, sparks) for space atmosphere

**Challenge 4: Collision Detection**
- **Issue:** Detecting when orbs reach the center accurately.
- **Solution:** Used distance-based collision detection with a tolerance threshold (30 pixels) to determine when an orb reaches the center.

**Challenge 5: Visual Effects and Design**
- **Issue:** Creating futuristic 2025 aesthetic with space theme.
- **Solution:** 
  - Removed grid patterns, created pure space backgrounds with animated stars
  - Implemented neon aesthetics throughout UI (glow effects, shadows)
  - Glassmorphism for HUD elements (semi-transparent with neon borders)
  - Multi-layer particle effects with blend modes (ADD for neon glow)
  - Avatar with 3-layer glow, rotating energy particles
  - Orbs as space objects with pulsing energy auras and meteor trails
  - Color-coded neon effects (cyan for UI, magenta for lives, etc.)

### Features Implemented

✅ Menu Scene with title, high score, and control instructions  
✅ Game Scene with responsive gameplay  
✅ Game Over Scene with score display and restart options  
✅ Avatar with multi-layer glow, ring, core, and rotating energy particles  
✅ Orb spawning from top of screen only (space meteor design)  
✅ Color matching system with 4 colors (RED, BLUE, YELLOW, GREEN)  
✅ Score system with localStorage persistence  
✅ Lives system (3 hearts) with life regain mechanic  
✅ Progressive difficulty (speed and spawn rate based on score and time)  
✅ Particle effects for all interactions (match, miss, color change, life gain)  
✅ Camera shake on miss  
✅ Audio feedback (hit, miss, change sounds + Star Wars style background music)  
✅ Reset high score option in game over  
✅ Responsive 16:9 canvas  
✅ Futuristic 2025 design with neon aesthetics  
✅ Space-themed backgrounds (black with animated stars)  
✅ Glassmorphism UI elements  
✅ Multi-layer visual effects with blend modes  

### Code Structure

```
ColorShiftDash-WJC/
├── index.html          # Main HTML file with Phaser CDN
├── main.js            # Game configuration and entry point
├── README.md          # Game instructions and setup guide
├── prompts.md         # This file - development documentation
├── assets/
│   └── audio/
│       ├── hit.wav    # Success sound effect
│       ├── miss.wav   # Error sound effect
│       ├── change.wav # Color switch sound
│       └── music.wav  # Star Wars style background music
└── src/
    ├── scenes/
    │   ├── BootScene.js       # Asset loading, audio file loading with procedural fallback
    │   ├── MenuScene.js       # Main menu with space background
    │   ├── GameScene.js       # Main gameplay with space theme
    │   └── GameOverScene.js   # Game over screen with space theme
    ├── objects/
    │   ├── Avatar.js          # Player avatar (space object with multi-layer glow)
    │   └── Orb.js             # Enemy orbs (space meteors with energy effects)
    └── utils/
        ├── ColorManager.js    # Color system management (4 colors, active colors)
        └── DifficultyManager.js # Difficulty progression (speed, spawn, learning phase)
```

### Design Evolution

**Initial Design:** Simple cyber runner style with grid patterns and basic colors

**Final Design (Futuristic 2025):**
- **Backgrounds:** Pure black space with animated stars/particles (no grid patterns)
- **UI Elements:** Glassmorphism with neon borders (cyan, magenta, yellow, green)
- **Avatar:** Multi-layer energy orb with:
  - Outer pulsing glow ring
  - Middle glow layer
  - Main body with stroke
  - 6 rotating energy particles
  - Dynamic color changes
  
- **Orbs:** Space meteors/asteroids with:
  - Energy aura (pulsing outer glow)
  - Energy field (middle glow layer)
  - Main body with rotation
  - Energy sparks around edges
  - Meteor trail (particles behind)

- **Effects:** 
  - Neon shadows and glows on all text
  - Blend mode ADD for neon brightness
  - Multi-layer particle explosions
  - Smooth animations and transitions

### Testing

The game was tested in Chrome browser and verified for:
- Smooth 60 FPS gameplay
- Proper collision detection (distance-based with tolerance)
- Audio playback (real WAV files with procedural fallback)
- Background music looping correctly
- High score persistence via localStorage
- Difficulty progression (learning phase + gradual increase)
- Life regain system (every 5 hits after losing a life)
- All visual effects (particles, glows, animations)
- Responsive scaling (16:9 aspect ratio maintained)
- Space theme consistency across all scenes
- Neon aesthetics and glassmorphism UI

### Audio System Details

**Real Audio Files Support:**
- Files located in `assets/audio/` folder
- Format: WAV (primary), MP3 (fallback)
- Required files:
  - `hit.wav` - Success sound (800Hz sine, 0.15s)
  - `miss.wav` - Error sound (200Hz sawtooth, 0.3s)
  - `change.wav` - Color switch sound (600Hz square, 0.08s)
  - `music.wav` - Background music (Star Wars style, 60s, loops)

**Automatic Fallback:**
- If audio files don't exist or fail to decode, game generates them procedurally
- Uses Web Audio API to create WAV blobs in memory
- Ensures game always has sounds, even without external files

**Music Features:**
- Epic Star Wars-inspired orchestral sound
- 5 layers (sub-bass, bass, melody, harmony, high)
- Minor pentatonic scale with rich harmonics
- Smooth attack/release for epic swells
- LFO modulation for organic movement
- Plays in loop during gameplay
- Stops automatically on game over

### Future Enhancements (Not in MVP)

- Orbs that flash color before fixing
- Combo/multiplier system
- Avatar skins/unlocks
- More elaborate menu animations
- Mobile touch controls
- Online leaderboards
- Power-ups (slow motion, shield, etc.)
- Boss orbs (special patterns)
- Achievement system

---

### Key Improvements During Development

1. **Difficulty Balancing:**
   - Initial speed too fast → Reduced base speed to 5 pixels/frame
   - Added dedicated learning phase (first 5 points)
   - Gradual progression after learning phase
   - Speed cap at 25 pixels/frame for playability

2. **Gameplay Refinements:**
   - Orbs spawn only from top (better anticipation)
   - Avatar positioned at bottom of screen
   - All 4 colors active from start
   - Life regain system (reward for consistency)

3. **Visual Polish:**
   - Removed all grid patterns for cleaner space theme
   - Simplified UI (removed unnecessary text overlays)
   - Cleaner color indicator (just the orb, no extra circles)
   - Better HUD positioning (hearts centered, controls guide)

4. **Audio System:**
   - Migrated from procedural-only to real files + fallback
   - Created Star Wars-style background music
   - Proper WAV file generation with Python script
   - Error handling for decoding failures

### Final Notes

The game successfully delivers a complete, polished arcade experience with:
- Smooth, responsive gameplay
- Beautiful futuristic 2025 aesthetic
- Engaging space theme
- Proper difficulty curve
- Satisfying feedback systems
- Professional audio design

All code is modular, well-organized, and ready for future enhancements.

---

**Developer:** WJC  
**Framework:** Phaser 3.80.0 (via CDN)  
**Language:** JavaScript (ES6 Modules)  
**Styling:** HTML5 Canvas, CSS  
**Audio:** WAV files with Web Audio API fallback  
**Storage:** LocalStorage for high scores  

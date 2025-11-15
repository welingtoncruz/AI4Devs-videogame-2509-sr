// GameScene - Main gameplay scene
// WJC

import Avatar from '../objects/Avatar.js';
import Orb from '../objects/Orb.js';
import ColorManager from '../utils/ColorManager.js';
import DifficultyManager from '../utils/DifficultyManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        this.centerX = width / 2;
        this.centerY = height - 100; // Avatar positioned near bottom of screen

        // Initialize managers
        this.colorManager = new ColorManager();
        this.difficultyManager = new DifficultyManager();

        // Game state
        this.score = 0;
        this.lives = 3;
        this.maxLives = 3; // Maximum lives
        this.startTime = this.time.now;
        this.orbs = [];
        this.lastSpawnTime = 0;
        this.hitsSinceLastLifeLoss = 0; // Counter for hits after losing a life
        this.hasLostLife = false; // Track if player has lost a life

        // Initialize active colors based on starting score
        const initialColorCount = this.difficultyManager.getColorCount(this.score);
        this.colorManager.setActiveColors(initialColorCount);

        // Create background
        this.createBackground();

        // Create avatar
        this.avatar = new Avatar(this, this.centerX, this.centerY);
        this.avatar.setColor(this.colorManager.getCurrentColor());

        // Create HUD
        this.createHUD();

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursorKeys = {
            UP: this.cursors.up,
            DOWN: this.cursors.down,
            LEFT: this.cursors.left,
            RIGHT: this.cursors.right
        };

        // Audio
        this.sounds = {
            hit: this.sound.add('hit', { volume: 0.5 }),
            miss: this.sound.add('miss', { volume: 0.5 }),
            change: this.sound.add('change', { volume: 0.3 })
        };

        // Background music (Star Wars style epic space music)
        // Check if music exists in cache and play it
        if (this.cache.audio.exists('music')) {
            this.music = this.sound.add('music', { 
                volume: 0.4, 
                loop: true
            });
            // Start playing the music
            this.music.play();
            console.log('Background music started');
        } else {
            console.warn('Music file not found in cache. Make sure music.wav exists in assets/audio/');
        }

        // Camera setup for shake
        this.cameras.main.setBounds(0, 0, width, height);
    }

    createBackground() {
        // Space-like background - pure black with only particles
        const graphics = this.add.graphics();
        const { width, height } = this.cameras.main;
        
        // Pure black space background
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(0, 0, width, height);
        
        // Store background graphics for potential updates
        this.backgroundGraphics = graphics;
        
        // Animated stars/particles in background (space effect)
        this.backgroundParticles = this.add.particles(0, 0, 'particle', {
            x: { min: 0, max: width },
            y: { min: 0, max: height },
            speedY: { min: 15, max: 50 },
            speedX: { min: -15, max: 15 },
            scale: { start: 0.25, end: 0 },
            tint: [0x00ffff, 0xffffff, 0x0088ff, 0x88ffff],
            lifespan: 5000,
            frequency: 120,
            alpha: { start: 0.5, end: 0 }
        });
    }

    createHUD() {
        // Futuristic HUD with neon styling 2025
        
        // Score background (glassmorphism effect)
        const scoreBg = this.add.rectangle(20, 20, 200, 45, 0x000000, 0.6);
        scoreBg.setStrokeStyle(2, 0x00ffff, 0.8);
        scoreBg.setOrigin(0, 0);
        scoreBg.setBlendMode(Phaser.BlendModes.ADD);
        
        // Score text with neon glow
        this.scoreText = this.add.text(30, 32, 'Score: 0', {
            fontSize: '28px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 2,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#00ffff',
                blur: 10,
                stroke: true,
                fill: true
            }
        });

        // Lives background (adjusted size)
        const livesBgWidth = 110;
        const livesBgHeight = 45;
        const livesBg = this.add.rectangle(this.cameras.main.width - 20, 20, livesBgWidth, livesBgHeight, 0x000000, 0.6);
        livesBg.setStrokeStyle(2, 0xff0088, 0.8);
        livesBg.setOrigin(1, 0);
        livesBg.setBlendMode(Phaser.BlendModes.ADD);
        
        // Lives text with neon effect (centered in box)
        this.livesText = this.add.text(this.cameras.main.width - 20 - (livesBgWidth / 2), 20 + (livesBgHeight / 2), '♥♥♥', {
            fontSize: '26px',
            fontFamily: 'Arial',
            color: '#ff0088',
            stroke: '#000000',
            strokeThickness: 2,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#ff0088',
                blur: 10,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);

        // Controls guide (bottom left) - show during gameplay
        this.createControlsGuide();

        // Current color indicator removed - controls guide shows colors
    }

    createControlsGuide() {
        const guideY = this.cameras.main.height - 100;
        const startX = 20;

        // Futuristic controls background
        const controlsBg = this.add.rectangle(startX, guideY - 15, 360, 70, 0x000000, 0.5);
        controlsBg.setStrokeStyle(2, 0x00ffff, 0.6);
        controlsBg.setOrigin(0, 0);
        controlsBg.setBlendMode(Phaser.BlendModes.ADD);

        // Title with neon effect
        this.add.text(startX + 10, guideY - 35, 'CONTROLS:', {
            fontSize: '18px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 2,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#00ffff',
                blur: 8,
                stroke: true,
                fill: true
            }
        });

        // Control legend with modern styling
        const controls = [
            { key: '↑', color: 'RED', hex: '#FF0000', neon: 0xff0088 },
            { key: '→', color: 'BLUE', hex: '#0080FF', neon: 0x0088ff },
            { key: '↓', color: 'YELLOW', hex: '#FFD700', neon: 0xffff00 },
            { key: '←', color: 'GREEN', hex: '#00FF00', neon: 0x00ff88 }
        ];

        controls.forEach((control, index) => {
            const x = startX + 30 + (index * 80);
            const y = guideY + 15;

            // Neon background for each key
            const keyBg = this.add.rectangle(x, y, 50, 30, 0x000000, 0.6);
            keyBg.setStrokeStyle(1, control.neon, 0.8);
            keyBg.setBlendMode(Phaser.BlendModes.ADD);

            // Arrow key display with glow
            const keyText = this.add.text(x, y - 5, control.key, {
                fontSize: '22px',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                color: control.hex,
                stroke: '#ffffff',
                strokeThickness: 1,
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    color: control.hex,
                    blur: 6,
                    stroke: true,
                    fill: true
                }
            }).setOrigin(0.5);

            // Color name
            this.add.text(x, y + 18, control.color, {
                fontSize: '11px',
                fontFamily: 'Arial',
                color: control.hex,
                stroke: '#000000',
                strokeThickness: 1
            }).setOrigin(0.5);
        });
    }


    handleInput() {
        // Check for color change
        Object.keys(this.cursorKeys).forEach(key => {
            if (Phaser.Input.Keyboard.JustDown(this.cursorKeys[key])) {
                const changed = this.colorManager.changeColor(key);
                if (changed) {
                    this.avatar.setColor(this.colorManager.getCurrentColor());
                    this.avatar.createChangeEffect(this.colorManager.getCurrentColor());
                    this.sounds.change.play();
                }
            }
        });
    }

    spawnOrb() {
        const timeElapsed = this.time.now - this.startTime;
        const spawnInterval = this.difficultyManager.getSpawnInterval(this.score, timeElapsed);

        if (this.time.now - this.lastSpawnTime >= spawnInterval) {
            // Update active colors based on current score
            const colorCount = this.difficultyManager.getColorCount(this.score);
            this.colorManager.setActiveColors(colorCount);

            // Random edge spawn
            const edge = Phaser.Math.Between(0, 3);
            let x, y;

            // Game design: Spawn orbs only from top, randomly across width
            // Avatar is at bottom, so orbs come from top
            const spawnOffset = 100; // Spawn 100 pixels above screen
            x = Phaser.Math.Between(50, this.cameras.main.width - 50); // Random X position
            y = -spawnOffset; // Always from top

            // Get random active color
            const color = this.colorManager.getRandomActiveColor();
            const speed = this.difficultyManager.getSpeed(this.score, timeElapsed);

            const orb = new Orb(this, x, y, this.centerX, this.centerY, color, speed);
            this.orbs.push(orb);
            this.lastSpawnTime = this.time.now;
        }
    }

    updateOrbs() {
        for (let i = this.orbs.length - 1; i >= 0; i--) {
            const orb = this.orbs[i];
            orb.update();

            // Check collision with avatar (check every frame)
            const dx = orb.x - this.centerX;
            const dy = orb.y - this.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const collisionRadius = 45; // Avatar radius (35) + orb radius (15) - 5 for tolerance

            if (distance <= collisionRadius) {
                // Collision detected - handle it
                this.handleOrbCollision(orb);
                orb.destroy();
                this.orbs.splice(i, 1);
            } else if (distance > this.cameras.main.width + this.cameras.main.height + 200) {
                // Orb went too far outside screen, destroy it (with extra margin)
                orb.destroy();
                this.orbs.splice(i, 1);
            }
        }
    }

    handleOrbCollision(orb) {
        const isMatch = this.colorManager.isMatch(orb.getColor());

        if (isMatch) {
            // Match!
            this.score++;
            this.updateScore();
            this.avatar.pulse();
            this.createMatchParticles(orb.getColor());
            this.sounds.hit.play();

            // Update difficulty
            const colorCount = this.difficultyManager.getColorCount(this.score);
            this.colorManager.setActiveColors(colorCount);

            // Life regain system: If lost a life, gain one back every 5 hits
            if (this.hasLostLife && this.lives < this.maxLives) {
                this.hitsSinceLastLifeLoss++;
                if (this.hitsSinceLastLifeLoss >= 5) {
                    this.gainLife();
                    this.hitsSinceLastLifeLoss = 0; // Reset counter
                }
            }
        } else {
            // Miss!
            this.lives--;
            this.hasLostLife = true; // Mark that player has lost a life
            this.hitsSinceLastLifeLoss = 0; // Reset hit counter
            this.updateLives();
            this.avatar.shake();
            this.cameras.main.shake(200, 0.02);
            this.createMissParticles();
            this.sounds.miss.play();

            if (this.lives <= 0) {
                // Use next frame to ensure everything is updated
                this.time.delayedCall(100, () => {
                    this.gameOver();
                });
            }
        }
    }

    gainLife() {
        // Only gain life if below max and has lost a life before
        if (this.lives < this.maxLives && this.hasLostLife) {
            this.lives++;
            this.updateLives();
            this.createLifeGainFeedback();
            
            // If reached max lives, reset the flag
            if (this.lives >= this.maxLives) {
                this.hasLostLife = false;
                this.hitsSinceLastLifeLoss = 0;
            }
        }
    }

    createLifeGainFeedback() {
        // Visual feedback for gaining a life - positioned below hearts in top right corner
        const { width, height } = this.cameras.main;
        const feedbackX = width - 20; // Right side, aligned with hearts
        const feedbackY = 70; // Below the hearts (hearts are at y=20, size ~32px)
        
        // Heart icon with animation (smaller, positioned in corner)
        const heartIcon = this.add.text(feedbackX, feedbackY, '♥', {
            fontSize: '40px',
            fontFamily: 'Arial',
            color: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 4
        }).setOrigin(1, 0).setAlpha(0);

        // Text feedback (smaller, positioned below heart)
        const feedbackText = this.add.text(feedbackX, feedbackY + 35, 'LIFE GAINED!', {
            fontSize: '20px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0).setAlpha(0);

        // Animate heart appearing
        this.tweens.add({
            targets: heartIcon,
            alpha: 1,
            scale: { from: 0.5, to: 1.2 },
            duration: 300,
            ease: 'Back.easeOut',
            yoyo: false
        });

        // Animate text appearing
        this.tweens.add({
            targets: feedbackText,
            alpha: 1,
            scale: { from: 0.8, to: 1 },
            duration: 300,
            ease: 'Power2',
            yoyo: false
        });

        // Animate both fading out and moving up slightly
        this.tweens.add({
            targets: [heartIcon, feedbackText],
            alpha: 0,
            y: '-=30',
            duration: 500,
            delay: 1200,
            ease: 'Power2',
            onComplete: () => {
                heartIcon.destroy();
                feedbackText.destroy();
            }
        });

        // Particles celebration at feedback position (smaller)
        const particles = this.add.particles(feedbackX, feedbackY + 20, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.6, end: 0 },
            tint: [0x00ff00, 0xff0000, 0xffff00],
            lifespan: 800,
            quantity: 20,
            angle: { min: 180, max: 360 } // Particles go upward
        });

        this.time.delayedCall(1500, () => {
            particles.destroy();
        });
    }

    createMatchParticles(color) {
        const colorValue = color.value || color;
        
        // Enhanced futuristic particle explosion
        const particles = this.add.particles(this.centerX, this.centerY, 'particle', {
            speed: { min: 120, max: 250 },
            scale: { start: 0.8, end: 0 },
            tint: colorValue,
            lifespan: 600,
            quantity: 30,
            angle: { min: 0, max: 360 },
            blendMode: Phaser.BlendModes.ADD,
            alpha: { start: 1, end: 0 }
        });

        // Additional outer ring particles
        const ringParticles = this.add.particles(this.centerX, this.centerY, 'particle', {
            speed: { min: 50, max: 100 },
            scale: { start: 1.2, end: 0 },
            tint: [colorValue, 0xffffff, colorValue],
            lifespan: 800,
            quantity: 15,
            angle: { min: 0, max: 360 },
            blendMode: Phaser.BlendModes.ADD,
            alpha: { start: 0.8, end: 0 }
        });

        this.time.delayedCall(800, () => {
            particles.destroy();
            ringParticles.destroy();
        });
    }

    createMissParticles() {
        // Enhanced miss particles with shockwave effect
        const particles = this.add.particles(this.centerX, this.centerY, 'particle', {
            speed: { min: 180, max: 300 },
            scale: { start: 1.0, end: 0 },
            tint: [0xff0000, 0xff6600, 0xff0088],
            lifespan: 700,
            quantity: 40,
            angle: { min: 0, max: 360 },
            blendMode: Phaser.BlendModes.ADD,
            alpha: { start: 1, end: 0 }
        });

        // Shockwave ring effect
        const shockwave = this.add.particles(this.centerX, this.centerY, 'particle', {
            speed: { min: 80, max: 120 },
            scale: { start: 2.0, end: 0 },
            tint: 0xff0000,
            lifespan: 600,
            quantity: 20,
            angle: { min: 0, max: 360 },
            blendMode: Phaser.BlendModes.ADD,
            alpha: { start: 0.6, end: 0 }
        });

        this.time.delayedCall(700, () => {
            particles.destroy();
            shockwave.destroy();
        });
    }

    updateScore() {
        this.scoreText.setText(`Score: ${this.score}`);
    }

    updateLives() {
        const hearts = '♥'.repeat(this.lives);
        this.livesText.setText(hearts);
        // Keep text centered
        const livesBgWidth = 110;
        const livesBgHeight = 45;
        this.livesText.setPosition(
            this.cameras.main.width - 20 - (livesBgWidth / 2),
            20 + (livesBgHeight / 2)
        );
    }

    gameOver() {
        // Stop background music when game ends
        if (this.music && this.music.isPlaying) {
            this.music.stop();
        }

        // Update high score
        const currentHighScore = parseInt(localStorage.getItem('colorShiftDashHighScore') || 0);
        if (this.score > currentHighScore) {
            localStorage.setItem('colorShiftDashHighScore', this.score.toString());
        }

        // Pass score to GameOverScene
        this.scene.start('GameOverScene', { score: this.score, highScore: Math.max(this.score, currentHighScore) });
    }

    update() {
        this.handleInput();
        this.spawnOrb();
        this.updateOrbs();
    }
}


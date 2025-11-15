// GameOverScene - Game over screen
// WJC

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.highScore = data.highScore || 0;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Futuristic background
        this.createBackground();

        // Game Over text with neon effect
        const gameOverText = this.add.text(width / 2, height * 0.3, 'GAME OVER', {
            fontSize: '80px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#ff0088',
            stroke: '#000000',
            strokeThickness: 5,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#ff0088',
                blur: 25,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);
        
        // Pulsing animation
        this.tweens.add({
            targets: gameOverText,
            alpha: { from: 0.9, to: 1.0 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Final Score with neon effect (no background box)
        this.add.text(width / 2, height * 0.42, `Final Score`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 2,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#00ffff',
                blur: 12,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);
        
        this.add.text(width / 2, height * 0.48, `${this.finalScore}`, {
            fontSize: '48px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#ffffff',
                blur: 15,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);

        // High Score with neon effect (no background box)
        this.add.text(width / 2, height * 0.58, `High Score: ${this.highScore}`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 3,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#ffff00',
                blur: 15,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);

        // New high score message with neon effect
        if (this.finalScore === this.highScore && this.finalScore > 0) {
            const newRecordText = this.add.text(width / 2, height * 0.68, 'NEW HIGH SCORE!', {
                fontSize: '36px',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                color: '#00ff00',
                stroke: '#000000',
                strokeThickness: 3,
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#00ff00',
                    blur: 20,
                    stroke: true,
                    fill: true
                }
            }).setOrigin(0.5);
            
            // Pulsing animation for new record
            this.tweens.add({
                targets: newRecordText,
                scale: { from: 1.0, to: 1.1 },
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Enhanced celebration particles
            this.time.delayedCall(100, () => {
                const particles = this.add.particles(width / 2, height * 0.68, 'particle', {
                    speed: { min: 120, max: 250 },
                    scale: { start: 1.0, end: 0 },
                    tint: [0x00ff00, 0xffff00, 0x00ffff, 0xff00ff],
                    lifespan: 1200,
                    quantity: 60,
                    angle: { min: 0, max: 360 },
                    blendMode: Phaser.BlendModes.ADD,
                    alpha: { start: 1, end: 0 }
                });

                this.time.delayedCall(1200, () => {
                    particles.destroy();
                });
            });
        }

        // Reset high score option - removed or made more subtle (no background)
        const resetText = this.add.text(width / 2, height * 0.92, 'Press R to Reset High Score', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#555555',
            stroke: '#000000',
            strokeThickness: 1,
            alpha: 0.5
        }).setOrigin(0.5);

        // Restart/Menu instructions with neon effect (no background)
        const instructionText = this.add.text(width / 2, height * 0.8, 'Press SPACE to Play Again\nPress ESC to Return to Menu', {
            fontSize: '26px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#00ff00',
                blur: 12,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);

        // Blinking effect
        this.tweens.add({
            targets: instructionText,
            alpha: { from: 0.8, to: 1.0 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Input
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    createBackground() {
        // Space-like background - black with animations only
        const graphics = this.add.graphics();
        const { width, height } = this.cameras.main;
        
        // Black background
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(0, 0, width, height);

        // Animated diagonal energy lines (space effect - magenta theme)
        const time = this.time.now;
        graphics.lineStyle(2, 0xff0088, 0.25);
        const lines = 12;
        for (let i = -3; i < lines; i++) {
            const offset = (time % 15000) / 75;
            const x1 = (width / lines) * i + offset;
            const y1 = 0;
            const x2 = (width / lines) * (i + 1) + offset;
            const y2 = height;
            
            const intensity = 0.15 + Math.sin(i * 0.5 + time / 2000) * 0.1;
            graphics.lineStyle(2, 0xff0088, intensity);
            
            graphics.moveTo(x1, y1);
            graphics.lineTo(x2, y2);
        }
        graphics.strokePath();
        
        // Ambient stars/particles (space effect - red/magenta theme)
        this.backgroundParticles = this.add.particles(0, 0, 'particle', {
            x: { min: 0, max: width },
            y: { min: 0, max: height },
            speedY: { min: 10, max: 40 },
            speedX: { min: -10, max: 10 },
            scale: { start: 0.3, end: 0 },
            tint: [0xff0088, 0xff0000, 0xff6600],
            lifespan: 4000,
            frequency: 150,
            alpha: { start: 0.5, end: 0 }
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start('GameScene');
        }

        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.scene.start('MenuScene');
        }

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            localStorage.removeItem('colorShiftDashHighScore');
            this.scene.restart({ score: this.finalScore, highScore: 0 });
        }
    }
}


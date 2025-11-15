// MenuScene - Main menu screen
// WJC - Fixed getLast() error

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background effect (cyber runner style)
        this.createBackground();

        // Title with futuristic neon effect
        const title = this.add.text(width / 2, height * 0.25, 'COLOR SHIFT DASH', {
            fontSize: '72px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 5,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#00ffff',
                blur: 20,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);
        
        // Animated title glow
        this.tweens.add({
            targets: title,
            alpha: { from: 0.8, to: 1.0 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // High score with neon effect
        const highScore = localStorage.getItem('colorShiftDashHighScore') || 0;
        this.add.text(width / 2, height * 0.4, `High Score: ${highScore}`, {
            fontSize: '36px',
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

        // Controls legend with neon styling
        const controlsY = height * 0.55;
        this.add.text(width / 2, controlsY, 'CONTROLS', {
            fontSize: '32px',
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

        // Color controls with arrows - better spacing
        const controls = [
            { key: '↑', color: 'RED', hex: '#FF0000' },
            { key: '→', color: 'BLUE', hex: '#0080FF' },
            { key: '↓', color: 'YELLOW', hex: '#FFD700' },
            { key: '←', color: 'GREEN', hex: '#00FF00' }
        ];

        const controlSpacing = 100; // Increased spacing
        const startX = width / 2 - ((controls.length - 1) * controlSpacing) / 2;
        const startY = controlsY + 50;

        controls.forEach((control, index) => {
            const x = startX + (index * controlSpacing);
            const y = startY;
            const boxWidth = 70;
            const boxHeight = 50;

            // Arrow key display with neon background
            const keyColorValue = parseInt(control.hex.replace('#', ''), 16);
            const keyBg = this.add.rectangle(x, y, boxWidth, boxHeight, 0x000000, 0.7);
            keyBg.setStrokeStyle(2, keyColorValue, 0.9);
            keyBg.setBlendMode(Phaser.BlendModes.ADD);
            
            // Arrow key (centered vertically in top half of box)
            this.add.text(x, y - 10, control.key, {
                fontSize: '32px',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                color: control.hex,
                stroke: '#ffffff',
                strokeThickness: 2,
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    color: control.hex,
                    blur: 10,
                    stroke: true,
                    fill: true
                }
            }).setOrigin(0.5);

            // Color name below arrow (inside bottom half of box)
            this.add.text(x, y + 12, control.color, {
                fontSize: '12px',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                color: control.hex,
                stroke: '#000000',
                strokeThickness: 1
            }).setOrigin(0.5);
        });

        // Start instruction
        const startText = this.add.text(width / 2, height * 0.75, 'Press SPACE to Start', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Blinking effect
        this.tweens.add({
            targets: startText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Input
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    createBackground() {
        // Space-like background - black with animations only
        const graphics = this.add.graphics();
        const { width, height } = this.cameras.main;

        // Black background
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(0, 0, width, height);

        // Animated diagonal energy lines (space effect)
        const time = this.time.now;
        graphics.lineStyle(2, 0x00ffff, 0.25);
        const lines = 12;
        for (let i = -3; i < lines; i++) {
            const offset = (time % 15000) / 75;
            const x1 = (width / lines) * i + offset;
            const y1 = 0;
            const x2 = (width / lines) * (i + 1) + offset;
            const y2 = height;
            
            const intensity = 0.15 + Math.sin(i * 0.5 + time / 2000) * 0.1;
            graphics.lineStyle(2, 0x00ffff, intensity);
            
            graphics.moveTo(x1, y1);
            graphics.lineTo(x2, y2);
        }
        graphics.strokePath();

        // Animated stars/particles (space effect)
        this.particles = this.add.particles(0, 0, 'particle', {
            x: { min: 0, max: width },
            y: { min: 0, max: height },
            speedY: { min: 10, max: 40 },
            speedX: { min: -10, max: 10 },
            scale: { start: 0.3, end: 0 },
            tint: [0x00ffff, 0xffffff, 0x0088ff],
            lifespan: 4000,
            frequency: 150,
            alpha: { start: 0.6, end: 0 }
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start('GameScene');
        }
    }
}


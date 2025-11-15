// Avatar - Player character in center of screen
// WJC

export default class Avatar extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        // Multi-layer futuristic avatar design 2025
        
        // Outer pulse ring (animated)
        this.outerPulse = scene.add.circle(0, 0, 60, 0x00ffff, 0.15);
        this.outerPulse.setBlendMode(Phaser.BlendModes.ADD);
        this.outerPulse.setStrokeStyle(2, 0x00ffff, 0.4);
        
        // Middle glow ring
        this.ring = scene.add.circle(0, 0, 52, 0xffffff, 0.25);
        this.ring.setStrokeStyle(4, 0xffffff, 0.7);
        this.ring.setBlendMode(Phaser.BlendModes.ADD);
        
        // Inner glow layer
        this.glow = scene.add.circle(0, 0, 45, 0xffffff, 0.3);
        this.glow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Main core with gradient effect
        this.core = scene.add.circle(0, 0, 35, 0xff0000, 1);
        this.core.setStrokeStyle(3, 0xffffff, 1);
        
        // Inner highlight (white dot)
        this.highlight = scene.add.circle(-8, -8, 12, 0xffffff, 0.7);
        this.highlight.setBlendMode(Phaser.BlendModes.ADD);
        
        // Energy particles around core (static)
        this.energyParticles = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const px = Math.cos(angle) * 42;
            const py = Math.sin(angle) * 42;
            const particle = scene.add.circle(px, py, 2, 0x00ffff, 0.6);
            particle.setBlendMode(Phaser.BlendModes.ADD);
            this.energyParticles.push(particle);
        }

        this.add([this.outerPulse, this.ring, this.glow, this.core, this.highlight, ...this.energyParticles]);

        // Futuristic animations
        // Outer pulse animation
        this.scene.tweens.add({
            targets: this.outerPulse,
            scaleX: { from: 0.9, to: 1.15 },
            scaleY: { from: 0.9, to: 1.15 },
            alpha: { from: 0.1, to: 0.25 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Ring pulsing
        this.scene.tweens.add({
            targets: this.ring,
            scaleX: { from: 1.0, to: 1.1 },
            scaleY: { from: 1.0, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Energy particles rotation
        this.scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });

        scene.add.existing(this);
    }

    setColor(color) {
        const colorValue = typeof color === 'object' ? color.value : color;
        
        // Update core
        this.core.setFillStyle(colorValue, 1);
        this.core.setStrokeStyle(3, 0xffffff, 1);
        
        // Update glow layers with color tint
        this.glow.setFillStyle(colorValue, 0.4);
        this.glow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Update ring with color
        this.ring.setStrokeStyle(4, colorValue, 0.9);
        this.ring.setFillStyle(colorValue, 0.2);
        
        // Update outer pulse with complementary color
        this.outerPulse.setStrokeStyle(2, colorValue, 0.5);
        this.outerPulse.setFillStyle(colorValue, 0.15);
        
        // Update energy particles
        this.energyParticles.forEach(particle => {
            particle.setFillStyle(colorValue, 0.7);
        });
    }

    pulse() {
        this.scene.tweens.add({
            targets: [this.core, this.glow],
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 150,
            yoyo: true,
            ease: 'Back.easeOut'
        });
    }

    shake() {
        this.scene.tweens.add({
            targets: this,
            x: this.x + Phaser.Math.Between(-5, 5),
            y: this.y + Phaser.Math.Between(-5, 5),
            duration: 50,
            yoyo: true,
            repeat: 5,
            ease: 'Power2'
        });
    }

    createChangeEffect(color) {
        // Create particles for color change
        const particles = this.scene.add.particles(0, 0, 'particle', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.3, end: 0 },
            tint: color.value || color,
            lifespan: 300,
            quantity: 10
        });
        particles.setPosition(this.x, this.y);
        
        this.scene.time.delayedCall(300, () => {
            particles.destroy();
        });
    }
}


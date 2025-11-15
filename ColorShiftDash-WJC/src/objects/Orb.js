// Orb - Enemy objects that move towards center
// WJC

export default class Orb extends Phaser.GameObjects.Container {
    constructor(scene, x, y, targetX, targetY, color, speed) {
        super(scene, x, y);

        this.colorData = color;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = speed;

        const colorValue = typeof color === 'object' ? color.value : color;

        // Space object design - meteors/asteroids with energy glow
        
        // Outer energy aura (space object glow)
        this.outerAura = scene.add.circle(0, 0, 24, colorValue, 0.25);
        this.outerAura.setBlendMode(Phaser.BlendModes.ADD);
        this.outerAura.setStrokeStyle(2, colorValue, 0.5);
        
        // Middle glow layer (energy field)
        this.outerGlow = scene.add.circle(0, 0, 20, colorValue, 0.4);
        this.outerGlow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Main orb body (space object - meteor/asteroid)
        this.orb = scene.add.circle(0, 0, 15, colorValue, 1);
        this.orb.setStrokeStyle(4, 0xffffff, 0.95);
        // Add rotation to simulate space object
        const initialRotation = Phaser.Math.FloatBetween(0, Math.PI * 2);
        this.orb.setRotation(initialRotation);
        
        // Energy sparks around the object (space effect)
        this.sparks = scene.add.particles(0, 0, 'particle', {
            speed: { min: 5, max: 12 },
            scale: { start: 0.2, end: 0 },
            tint: [colorValue, 0xffffff],
            lifespan: 350,
            frequency: 70,
            alpha: { start: 0.8, end: 0 },
            blendMode: Phaser.BlendModes.ADD,
            emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 15), quantity: 6 },
            follow: this
        });
        
        // Trail particles (meteor trail - will be updated in update method)
        this.trail = [];
        this.lastTrailUpdate = 0;

        this.add([this.outerAura, this.outerGlow, this.orb]);

        // Pulsing animation for aura (energy pulsing)
        scene.tweens.add({
            targets: this.outerAura,
            scaleX: { from: 1.0, to: 1.25 },
            scaleY: { from: 1.0, to: 1.25 },
            alpha: { from: 0.2, to: 0.35 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Slow rotation animation (space object rotating)
        scene.tweens.add({
            targets: this.orb,
            rotation: initialRotation + Math.PI * 2,
            duration: Phaser.Math.Between(2500, 5000),
            repeat: -1,
            ease: 'Linear'
        });

        // Calculate direction vector
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.velocityX = (dx / distance) * speed;
        this.velocityY = (dy / distance) * speed;

        // Container rotation animation (whole space object rotating)
        scene.tweens.add({
            targets: this,
            angle: 360,
            duration: Phaser.Math.Between(3000, 6000),
            repeat: -1,
            ease: 'Linear'
        });

        scene.add.existing(this);
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Create meteor trail effect (space object trailing particles)
        const now = this.scene.time.now;
        if (now - this.lastTrailUpdate > 40) { // Update trail every 40ms for smoother effect
            if (this.trail.length < 6) {
                const colorValue = typeof this.colorData === 'object' ? this.colorData.value : this.colorData;
                // Trail particles behind the meteor (angle 90 = down)
                const trailParticle = this.scene.add.circle(this.x, this.y + 10, 4, colorValue, 0.6);
                trailParticle.setBlendMode(Phaser.BlendModes.ADD);
                
                this.scene.tweens.add({
                    targets: trailParticle,
                    alpha: 0,
                    scale: 0,
                    y: trailParticle.y + 30,
                    duration: 400,
                    onComplete: () => trailParticle.destroy()
                });
                
                this.trail.push(trailParticle);
            }
            this.lastTrailUpdate = now;
        }

        // Check if reached center (with tolerance)
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < 30; // Return true if reached center
    }

    getColor() {
        return this.colorData;
    }
}


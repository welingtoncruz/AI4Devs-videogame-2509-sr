// ColorManager - Manages color system and active colors
// WJC

export default class ColorManager {
    constructor() {
        this.colors = {
            RED: { name: 'RED', value: 0xff0000, hex: '#FF0000', key: 'UP' },
            BLUE: { name: 'BLUE', value: 0x0080ff, hex: '#0080FF', key: 'RIGHT' },
            YELLOW: { name: 'YELLOW', value: 0xffd700, hex: '#FFD700', key: 'DOWN' },
            GREEN: { name: 'GREEN', value: 0x00ff00, hex: '#00FF00', key: 'LEFT' }
        };

        this.activeColors = [this.colors.RED, this.colors.BLUE, this.colors.YELLOW, this.colors.GREEN]; // Start with all 4 colors
        this.currentColor = this.colors.RED;
    }

    setActiveColors(count) {
        const allColors = [this.colors.RED, this.colors.BLUE, this.colors.YELLOW, this.colors.GREEN];
        this.activeColors = allColors.slice(0, count);
        
        // Ensure current color is still active (compare by value)
        const currentColorValue = this.currentColor.value || this.currentColor;
        const isCurrentColorActive = this.activeColors.some(color => 
            (color.value || color) === currentColorValue
        );
        
        if (!isCurrentColorActive && this.activeColors.length > 0) {
            this.currentColor = this.activeColors[0];
        }
    }

    getColorByKey(key) {
        const keyMap = {
            'UP': this.colors.RED,
            'RIGHT': this.colors.BLUE,
            'DOWN': this.colors.YELLOW,
            'LEFT': this.colors.GREEN
        };
        return keyMap[key];
    }

    changeColor(key) {
        const newColor = this.getColorByKey(key);
        if (newColor) {
            // Allow color change regardless of active colors
            // Active colors only affect which colors orbs can spawn
            this.currentColor = newColor;
            return true;
        }
        return false;
    }

    getRandomActiveColor() {
        return Phaser.Utils.Array.GetRandom(this.activeColors);
    }

    isMatch(color) {
        // Compare by value, not reference
        if (!color || !this.currentColor) return false;
        return (color.value || color) === (this.currentColor.value || this.currentColor);
    }

    getCurrentColor() {
        return this.currentColor;
    }
}


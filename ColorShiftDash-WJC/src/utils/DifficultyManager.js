// DifficultyManager - Manages game difficulty progression
// WJC

export default class DifficultyManager {
    constructor() {
        // Game design: Start extremely slow for learning phase (first 5 points)
        // Tutorial phase: Very slow, plenty of time to learn controls
        this.learningPhaseScore = 5; // First 5 points are tutorial phase
        
        this.baseSpeed = 5; // Extremely slow initial speed for learning (pixels per frame)
        this.minSpawnInterval = 1500; // Minimum 1.5 seconds between spawns
        this.baseSpawnInterval = 4500; // 4.5 seconds between spawns in learning phase (very generous)
        
        // Difficulty thresholds - balanced progression based on skill
        // All 4 colors available from start for better gameplay variety
        // After 5 points (learning phase), difficulty increases gradually
        this.thresholds = [
            { score: 0, colorCount: 4, speedMultiplier: 1.0 }, // Learning phase (0-4 points)
            { score: 5, colorCount: 4, speedMultiplier: 1.05 }, // After learning phase, start difficulty
            { score: 10, colorCount: 4, speedMultiplier: 1.12 }, // Gradual increase
            { score: 18, colorCount: 4, speedMultiplier: 1.25 }, // Gradual increase
            { score: 28, colorCount: 4, speedMultiplier: 1.4 }, // Gradual increase
            { score: 40, colorCount: 4, speedMultiplier: 1.6 }, // Gradual increase
            { score: 55, colorCount: 4, speedMultiplier: 1.8 }, // Gradual increase
            { score: 75, colorCount: 4, speedMultiplier: 2.0 } // Max difficulty
        ];
    }

    getColorCount(score) {
        let colorCount = 4; // Start with all 4 colors (default)
        // Find the highest threshold the player has reached
        for (let i = this.thresholds.length - 1; i >= 0; i--) {
            if (score >= this.thresholds[i].score) {
                colorCount = this.thresholds[i].colorCount;
                break;
            }
        }
        return colorCount;
    }

    getSpeed(score, timeElapsed) {
        // Learning phase: Keep speed extremely low for first 5 points
        if (score < this.learningPhaseScore) {
            // Very slow and constant speed during learning phase
            return this.baseSpeed;
        }
        
        // After learning phase, start increasing difficulty gradually
        const threshold = this.getCurrentThreshold(score);
        // Game design: Speed increases gradually based on score after learning phase
        const scoreAfterLearning = score - this.learningPhaseScore;
        const scoreBonus = scoreAfterLearning * 0.1; // Each point after learning adds 0.1 pixels/frame (gradual)
        const timeBonus = timeElapsed / 30000; // Minimal time-based increase (every 30 seconds)
        const finalSpeed = this.baseSpeed + scoreBonus + timeBonus;
        // Apply threshold multiplier and cap at reasonable max
        return Math.min(finalSpeed * threshold.speedMultiplier, 25); // Max ~25 pixels/frame (~1500 pixels/sec)
    }

    getSpawnInterval(score, timeElapsed) {
        // Learning phase: Keep spawn interval very long for first 5 points
        if (score < this.learningPhaseScore) {
            // Very generous spawn interval during learning phase
            return this.baseSpawnInterval;
        }
        
        // After learning phase, gradually decrease spawn interval
        const threshold = this.getCurrentThreshold(score);
        // Game design: Spawn rate decreases gradually after learning phase
        const scoreAfterLearning = score - this.learningPhaseScore;
        const scoreReduction = scoreAfterLearning * 0.01; // Each point after learning reduces by 1% (gradual)
        const timeReduction = timeElapsed * 0.00006; // Minimal time-based reduction
        const reductionFactor = Math.max(0.35, 1 - scoreReduction - timeReduction);
        const interval = this.baseSpawnInterval * reductionFactor;
        // Never spawn faster than minimum interval (ensures reaction time)
        return Math.max(this.minSpawnInterval, interval);
    }

    getCurrentThreshold(score) {
        let current = this.thresholds[0];
        for (let i = this.thresholds.length - 1; i >= 0; i--) {
            if (score >= this.thresholds[i].score) {
                current = this.thresholds[i];
                break;
            }
        }
        return current;
    }
}


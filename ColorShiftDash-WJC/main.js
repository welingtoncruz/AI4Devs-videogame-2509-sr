// Color Shift Dash - Main Entry Point
// WJC

import BootScene from './src/scenes/BootScene.js';
import MenuScene from './src/scenes/MenuScene.js';
import GameScene from './src/scenes/GameScene.js';
import GameOverScene from './src/scenes/GameOverScene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1024,
    height: 576, // 16:9 ratio
    backgroundColor: '#0a0a0a',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [BootScene, MenuScene, GameScene, GameOverScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1024,
        height: 576,
        min: {
            width: 640,
            height: 360
        },
        max: {
            width: 1920,
            height: 1080
        }
    },
    audio: {
        disableWebAudio: false
    }
};

const game = new Phaser.Game(config);


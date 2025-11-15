// BootScene - Loads all assets
// WJC

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create a simple particle texture
        this.add.graphics()
            .fillStyle(0xffffff, 1)
            .fillCircle(0, 0, 4)
            .generateTexture('particle', 8, 8);

        // Load real audio files from assets/audio folder
        // Phaser will try to load these files. If they don't exist, 
        // the game will fall back to procedural generation (see create method)
        
        // Load hit sound (success sound) - tries WAV first, then MP3
        this.load.audio('hit', [
            'assets/audio/hit.wav',
            'assets/audio/hit.mp3'
        ]);

        // Load miss sound (error sound)
        this.load.audio('miss', [
            'assets/audio/miss.wav',
            'assets/audio/miss.mp3'
        ]);

        // Load change sound (color switch)
        this.load.audio('change', [
            'assets/audio/change.wav',
            'assets/audio/change.mp3'
        ]);

        // Load background music - WAV first
        this.load.audio('music', [
            'assets/audio/music.wav',
            'assets/audio/music.mp3'
        ]);
        
        // Track which audio files need procedural fallback
        this.audioFallbacks = {
            hit: true,
            miss: true,
            change: true,
            music: true
        };

        // Listen for successful file loads
        this.load.on('filecomplete-audio-hit', () => {
            this.audioFallbacks.hit = false;
        });
        this.load.on('filecomplete-audio-miss', () => {
            this.audioFallbacks.miss = false;
        });
        this.load.on('filecomplete-audio-change', () => {
            this.audioFallbacks.change = false;
        });
        this.load.on('filecomplete-audio-music', () => {
            this.audioFallbacks.music = false;
        });

        // Listen for load errors and mark for fallback
        this.load.on('loaderror', (file) => {
            if (file.type === 'audio' && this.audioFallbacks.hasOwnProperty(file.key)) {
                console.warn(`Audio file ${file.key} failed to load: ${file.url}, will generate procedurally`);
                // Keep fallback flag as true
            }
        });
        
        // Start loading
        this.load.start();
    }

    generateTone(frequency, duration, waveType = 'sine', volume = 0.3) {
        const sampleRate = 44100;
        const length = sampleRate * duration;
        const buffer = new ArrayBuffer(44 + length * 2);
        const view = new DataView(buffer);
        
        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, length * 2, true);
        
        // Generate waveform
        for (let i = 0; i < length; i++) {
            let sample = 0;
            const t = i / sampleRate;
            
            if (waveType === 'sine') {
                sample = Math.sin(2 * Math.PI * frequency * t);
            } else if (waveType === 'square') {
                sample = Math.sign(Math.sin(2 * Math.PI * frequency * t));
            } else if (waveType === 'sawtooth') {
                sample = 2 * ((t * frequency) % 1) - 1;
            }
            
            // Apply envelope (fade out)
            const envelope = 1 - (t / duration);
            sample *= envelope * volume * 32767;
            
            view.setInt16(44 + i * 2, sample, true);
        }
        
        const blob = new Blob([buffer], { type: 'audio/wav' });
        return URL.createObjectURL(blob);
    }

    generateBackgroundMusic() {
        // Create a simple ambient music track
        const notes = [523.25, 659.25, 783.99, 659.25]; // C5, E5, G5, E5
        const sampleRate = 44100;
        const bpm = 120;
        const beatDuration = 60 / bpm;
        const noteDuration = beatDuration * 2;
        
        let totalLength = 0;
        const buffers = [];
        
        notes.forEach((freq, index) => {
            const length = sampleRate * noteDuration;
            const buffer = new ArrayBuffer(44 + length * 2);
            const view = new DataView(buffer);
            
            // WAV header
            const writeString = (offset, string) => {
                for (let i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            };
            
            writeString(0, 'RIFF');
            view.setUint32(4, 36 + length * 2, true);
            writeString(8, 'WAVE');
            writeString(12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);
            view.setUint16(22, 1, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * 2, true);
            view.setUint16(32, 2, true);
            view.setUint16(34, 16, true);
            writeString(36, 'data');
            view.setUint32(40, length * 2, true);
            
            for (let i = 0; i < length; i++) {
                const t = i / sampleRate;
                let sample = Math.sin(2 * Math.PI * freq * t);
                
                // Add harmonics for richer sound
                sample += 0.3 * Math.sin(2 * Math.PI * freq * 2 * t);
                sample += 0.1 * Math.sin(2 * Math.PI * freq * 3 * t);
                
                // Envelope
                const attack = Math.min(t / 0.1, 1);
                const release = Math.max(0, 1 - (t - (noteDuration - 0.1)) / 0.1);
                const envelope = attack * (t < noteDuration - 0.1 ? 1 : release);
                
                sample *= envelope * 0.2 * 32767;
                view.setInt16(44 + i * 2, sample, true);
            }
            
            buffers.push(new Uint8Array(buffer));
            totalLength += length * 2;
        });
        
        // Combine all notes
        const combinedBuffer = new ArrayBuffer(44 + totalLength);
        const combinedView = new DataView(combinedBuffer);
        const combinedWriteString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                combinedView.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        combinedWriteString(0, 'RIFF');
        combinedView.setUint32(4, 36 + totalLength, true);
        combinedWriteString(8, 'WAVE');
        combinedWriteString(12, 'fmt ');
        combinedView.setUint32(16, 16, true);
        combinedView.setUint16(20, 1, true);
        combinedView.setUint16(22, 1, true);
        combinedView.setUint32(24, sampleRate, true);
        combinedView.setUint32(28, sampleRate * 2, true);
        combinedView.setUint16(32, 2, true);
        combinedView.setUint16(34, 16, true);
        combinedWriteString(36, 'data');
        combinedView.setUint32(40, totalLength, true);
        
        let offset = 44;
        buffers.forEach(buffer => {
            new Uint8Array(combinedBuffer, offset).set(buffer.slice(44));
            offset += buffer.length - 44;
        });
        
        const blob = new Blob([combinedBuffer], { type: 'audio/wav' });
        const musicUrl = URL.createObjectURL(blob);
        return musicUrl;
    }

    create() {
        // Generate procedural audio for any files that failed to load
        // This ensures the game always has sounds, even if real files aren't available
        
        const cache = this.cache.audio;
        let needsFallback = false;

        // Check which files need procedural fallback
        if (this.audioFallbacks.hit && !cache.exists('hit')) {
            console.log('Generating procedural hit sound...');
            const hitSound = this.generateTone(800, 0.1, 'sine', 0.3);
            this.load.audio('hit', hitSound);
            needsFallback = true;
        }

        if (this.audioFallbacks.miss && !cache.exists('miss')) {
            console.log('Generating procedural miss sound...');
            const missSound = this.generateTone(200, 0.2, 'sawtooth', 0.4);
            this.load.audio('miss', missSound);
            needsFallback = true;
        }

        if (this.audioFallbacks.change && !cache.exists('change')) {
            console.log('Generating procedural change sound...');
            const changeSound = this.generateTone(600, 0.05, 'square', 0.2);
            this.load.audio('change', changeSound);
            needsFallback = true;
        }

        // Fallback: Generate music if file not loaded or failed to decode
        if (this.audioFallbacks.music && !cache.exists('music')) {
            console.log('Generating procedural background music...');
            const musicUrl = this.generateBackgroundMusic();
            this.load.audio('music', musicUrl);
            needsFallback = true;
        }

        // If fallbacks were needed, wait for them to load
        if (needsFallback) {
            this.load.once('complete', () => {
                this.scene.start('MenuScene');
            });
            this.load.start();
        } else {
            // All sounds loaded (real files), start MenuScene immediately
            this.scene.start('MenuScene');
        }
    }
}


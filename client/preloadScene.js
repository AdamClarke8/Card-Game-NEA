import Phaser from 'phaser';

import fontPixelated from './assets/fonts/default-pixilart-text.otf.woff2';
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js';

// Scene that shows when the game starts
class PreloadScene extends Phaser.Scene {
    constructor() {
        super('preload');
    }
    preload() {
        this.load.font('Pixelated', fontPixelated, 'woff2');
    }
    create() {

        // Splash text when starting game
        const text = this.add.rexBBCodeText({
            x: 400,
            y: 300,
            text: "CLICK TO PLAY",
            style: {
                fontFamily: 'Pixelated',
                color: 'black',
                fontSize: '32px',
                wrap: {
                    mode: 'word',
                    width: 800
                }
            }
        }).setOrigin(0.5, 0.5);
        // Place text at the centre

        var mode = text.style.wrapMode;
        text.setWrapMode(mode);
        var width = text.style.wrapWidth;
        text.setWrapWidth(width);

        this.input.on('pointerdown', () => this.scene.start('match'))
    }
}

export default PreloadScene;
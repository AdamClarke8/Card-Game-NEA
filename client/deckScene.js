import Phaser from 'phaser';
import cardData from './assets/cardData.json';
import fontPixelated from './assets/fonts/default-pixilart-text.otf.woff2';
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js';

import CardDatabase from './cardDatabase.js'
import Player from "./player.js"
import Deck from "./deck.js"
import Card from './card.js'
import ZoomTexture from './zoomTexture.js'

// Scene that shows when the game starts
class DeckScene extends Phaser.Scene {
    constructor() {
        super('deck');
    }
    preload() {

        // Load all card-specific images with extension .png (eager loads them immediately)

        const cardIcons = import.meta.glob('./assets/cardIcons/cards/*.png', { eager: true });
        // Preload images
        for (const path in cardIcons) {
            const key = path.split("/").pop().replace(".png", "");
            const mod = cardIcons[path].default;
            this.load.image(key, mod);
        }

        // Load all general card images with extension .png (eager loads them immediately)
        const generalCardIcons = import.meta.glob('./assets/cardIcons/*.png', { eager: true });

        // Preload images
        for (const path in generalCardIcons) {
            const key = path.split("/").pop().replace(".png", "");
            const mod = generalCardIcons[path].default;
            this.load.image(key, mod);
        }

        // Load card data
        this.load.json('cardData', cardData);

        this.load.font('Pixelated', fontPixelated, 'woff2');
    }
    create() {

        this.cardDatabase = new CardDatabase(this);

        // Create a new instance of a zoom texture
        this.rt = new ZoomTexture(this, 400, 300, 800, 600);

        // Splash text when starting game
        const text = this.add.rexBBCodeText({
            x: 400,
            y: 300,
            text: "DECK SCENE",
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

        this.player = this.registry.get('player');
        console.log(this.player);

        const deck = this.player.deck;
        let xOffset = 100;
        let count = 0;

        const scene = this;
        const rects = [];

        //const firstCard = deck.cards.keys()[0];
        //console.log(firstCard);
        //const card = new Card(scene, 300, 300, firstCard, 0.25);
        for (const cardName in deck.cards) {
            let val = deck.cards[cardName];
            console.log(`Card name is ${cardName}, number is ${val}`);
            count += 1;
            let container = scene.add.container(600, 25 + (count - 1) * 50);
            let rect = scene.add.rectangle(0, 0, 200, 50, 0xffffff, 1).setOrigin(0, 0.5);
            container.add(rect);
            let nameText = scene.add.text(10, 0, cardName, { color: 'black', fontFamily: 'Pixelated', fontSize: '12px' }).setOrigin(0, 0.5);
            container.add(nameText);
            let countText = scene.add.text(160, 0, `x${val}`, { color: 'gray', fontFamily: 'Pixelated', fontSize: '12px' }).setOrigin(0, 0.5);
            container.add(countText);
            rect.setStrokeStyle(2, 0x000000, 1);
            rects.push(container);
            //for (let i = 0; i < val; i++) {
                //count += 1;
                //let card = new Card(scene, xOffset + count * 50, 175, cardName, 0.15);
            //}
        }
        console.log(rects);
        //this.input.on('pointerdown', () => this.scene.start('match'))*/
    }
    update() {

    }
}

export default DeckScene;
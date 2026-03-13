import Phaser from 'phaser';
import cardData from './assets/cardData.json';
import fontPixelated from './assets/fonts/default-pixilart-text.otf.woff2';
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js';

import CardDatabase from './cardDatabase.js'
import Player from "./player.js"
import Deck from "./deck.js"
import Collection from "./collection.js"
import Card from './card.js'
import ZoomTexture from './zoomTexture.js'

import CardSlot from './cardSlot.js'
import Hand from './hand.js'

// Scene to display the player's collection
class MatchScene extends Phaser.Scene {
    constructor() {
        super('match');
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

        const scene = this;

        scene.player = scene.registry.get('player');
        const collection = scene.player.collection;
        const deck = scene.player.deck;
        scene.player.initTempDeck();

        console.log("Displaying deck...");
        deck.displayDeck();
        // Initialise card database
        scene.cardDatabase = new CardDatabase(scene);
        // Create a new instance of a zoom texture
        scene.rt = new ZoomTexture(this, 400, 300, 800, 600);

        const card = new Card(scene, 100, 200, "duckling", 0.125);

        const blueCardSlotVertices = [[100, 200], [250, 200], [400, 200], [550, 200], [700, 200]];
        const redCardSlotVertices = [[100, 400], [250, 400], [400, 400], [550, 400], [700, 400]];

        const cardSlots = [];

        for (let i = 0; i < blueCardSlotVertices.length; i++) {
            let vertex = blueCardSlotVertices[i];
            console.log(`Creating blue side vertex at: ${vertex}`);
            let cardSlot = new CardSlot(vertex[0], vertex[1], scene);
            cardSlots.push(cardSlot);
        }

        for (let i = 0; i < redCardSlotVertices.length; i++) {
            let vertex = redCardSlotVertices[i];
            console.log(`Creating red side vertex at: ${vertex}`);
            let cardSlot = new CardSlot(vertex[0], vertex[1], scene);
            cardSlots.push(cardSlot);
        }

        const hand = new Hand(scene, scene.player);
        hand.updateHandDisplay();
        /*
        const cardsInHand = [];

        let count = 0;
        let cardNames = Object.keys(deck.cards);

        cardNames.forEach((cardName) => {
            count += 1;
            
            let card = new Card(scene, 100 + count * 50, 550, cardName, 0.2);
            cardsInHand.push(card);
        })*/

        /*
        // Splash text when starting game
        const text = this.add.rexBBCodeText({
            x: 400,
            y: 300,
            text: "MATCH SCENE",
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
        */
        
        this.backButton = this.add.text(400, 100, "BACK", { color: 'black', fontFamily: 'Pixelated', fontSize: '48px' }).setOrigin(0.5, 0.5);
        this.backButton.on("pointerdown", () => {
            scene.scene.start('home');
        })
        this.backButton.setInteractive();
    }
    update() {

    }
}

export default MatchScene;
//await new Promise(r => setTimeout(r, 50));

import Phaser from 'phaser';
import cardData from './assets/cardData.json';
import fontPixelated from './assets/fonts/default-pixilart-text.otf.woff2';
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js';

import PreloadScene from './preloadScene.js'
import DeckScene from './deckScene.js'

import CardDatabase from './cardDatabase.js'
import Player from "./player.js"
import Deck from "./deck.js"
import Collection from "./collection.js"
import Card from "./card.js"
import ZoomTexture from './zoomTexture.js'

// Class to define the match scene


class MatchScene extends Phaser.Scene {
    constructor() {
        super('match');
    }

    init() {

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
        for(const path in generalCardIcons) {
            const key = path.split("/").pop().replace(".png", "");
            const mod = generalCardIcons[path].default;
            this.load.image(key, mod);
        }

        // Load card data
        this.load.json('cardData', cardData);

        // Add custom font
        this.load.font('Pixelated', fontPixelated, 'woff2');
    }
    
    create() {

        const scene = this;

        this.cardDatabase = new CardDatabase(this);

        this.player = new Player("Adam");
        this.player.collection.addCard("fireball", 4);
        this.player.collection.addCard("duckling", 3);
        this.player.collection.addCard("elixir", 4);


        this.player.collection.displayCollection();
        //this.player.deck.removeCard("fireball", 1);
        //this.player.deck.displayDeck();
        // Create a new instance of a zoom texture
        this.rt = new ZoomTexture(this, 400, 300, 800, 600);

        // Create new instances of cards
        this.card1 = new Card(this, 200, 175, "duckling", 0.25);
        this.card2 = new Card(this, 400, 175, "fireball", 0.25);
        this.card3 = new Card(this, 600, 175, "elixir", 0.25);
        //this.card1.changeCard("duckling");

        this.deckButton = this.add.text(400, 400, "GO TO DECK", { color: 'black', fontFamily: 'Pixelated', fontSize: '64px' }).setOrigin(0.5, 0.5);

        // When deck button is clicked, switch to deck scene
        this.deckButton.on("pointerdown", () => {
            scene.scene.start('deck');
        })

        // Allow deck button to respond to click events
        this.deckButton.setInteractive();

        this.registry.set('player', this.player)
    }

    update() {

    }

}

// Configuration for Phaser game
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '0x999999',
    scene: [PreloadScene, MatchScene, DeckScene],
    plugins: {
        // Custom fonts
        global: [{
            key: 'rexBBCodeTextPlugin',
            plugin: BBCodeTextPlugin,
            start: true
        }
        ]
    }
};

// Create a new game instance
const game = new Phaser.Game(config);

// DEBUGGING
function printMousePos(event) {
    console.log("clientX: " + event.clientX + " - clientY: " + event.clientY)

}

// Print the location of the user's mouse (x, y) when they click
document.addEventListener("click", printMousePos);
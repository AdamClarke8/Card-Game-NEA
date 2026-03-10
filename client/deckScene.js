import Phaser from 'phaser';
import cardData from './assets/cardData.json';
import fontPixelated from './assets/fonts/default-pixilart-text.otf.woff2';
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js';

import CardDatabase from './cardDatabase.js'
import Player from "./player.js"
import Deck from "./deck.js"
import Card from './card.js'
import ZoomTexture from './zoomTexture.js'

import {
    CardBox,
    CardBoxManager
} from "./cardBox.js"

import {
    AddCardButton,
    RemoveCardButton
} from "./cardButtons.js"

import {
    sortByMana,
    sortCardList
} from "./misc.js"

// Scene which displays the user's collection

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

        const scene = this;
        scene.player = scene.registry.get('player');

        // Initialise card database
        scene.cardDatabase = new CardDatabase(scene);
        // Initialise card box manager
        scene.cardBoxManager = new CardBoxManager(scene, 600, 75);

        // Create a new instance of a zoom texture
        scene.rt = new ZoomTexture(scene, 400, 300, 800, 600);


        const collection = scene.player.collection;
        const deck = scene.player.deck;

        let xOffset = 100;
        let count = 0;

        const boxes = [];

        const firstCard = Object.keys(collection.cards)[0];
        scene.cardSelector = new Card(scene, 200, 200, firstCard, 0.25);

        scene.player.deck.setNumCopies("elixir", 0);
        scene.player.deck.setNumCopies("fireball", 0);
        scene.player.deck.setNumCopies("duckling", 0);
        scene.player.collection.setNumCopies("elixir", 2);

        scene.player.displayPlayer();

        const cardNames = Object.keys(collection.cards);
        console.log(cardNames);

        const newCardList = sortCardList(scene.player, cardNames, scene.cardDatabase);

        newCardList.forEach((cardName) => {
            console.log(`Card name is ${cardName}`)
            scene.cardBoxManager.addCardBox(cardName);

        })
        /*
        for (const cardName in cardNames) {

            console.log(`Card name is ${cardName}`)
            scene.cardBoxManager.addCardBox(cardName);

        }
        */
        const addCardButton = new AddCardButton(scene, 450, 400);

        const removeCardButton = new RemoveCardButton(scene, 450, 500);

        // Label for collection button

        const collectionIcon = scene.add.image(450, 75, 'collection').setOrigin(0.5, 0.5);
        collectionIcon.setDisplaySize(207, 300);

        collectionIcon.on("pointerdown", () => {
            console.log("Switching to collection scene.");
            scene.scene.start("collection");
        })

        collectionIcon.setInteractive();

        const collectionText = scene.add.rexBBCodeText({
            x: 450,
            y: 150,
            text: "GO TO COLLECTION",
            style: {
                fontFamily: 'Pixelated',
                color: 'black',
                fontSize: '18px',
                wrap: {
                    mode: 'word',
                    width: 200
                }
            }
        }).setOrigin(0.5, 0.5);

        var mode = collectionText.style.wrapMode;
        collectionText.setWrapMode(mode);
        var width = collectionText.style.wrapWidth;
        collectionText.setWrapWidth(width);
        //this.input.on('pointerdown', () => this.scene.start('match'))*/

        this.backButton = this.add.text(175, 450, "BACK", { color: 'black', fontFamily: 'Pixelated', fontSize: '48px' }).setOrigin(0.5, 0.5);
        this.backButton.on("pointerdown", () => {
            scene.scene.start('home');
        })

        // Allow home button to respond to click events
        this.backButton.setInteractive();
    }
    update() {

    }
}

export default DeckScene;
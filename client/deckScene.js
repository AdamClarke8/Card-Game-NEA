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

class CardBox {
    constructor(scene, x, y, name, val) {
        const cardBox = this;
        cardBox.container = scene.add.container(x, y);

        cardBox.rect = scene.add.rectangle(0, 0, 200, 50, 0xffffff, 1).setOrigin(0, 0.5);
        cardBox.rect.setStrokeStyle(2, 0x000000, 1);
        cardBox.container.add(cardBox.rect);

        cardBox.nameText = scene.add.text(10, 0, name, { color: 'black', fontFamily: 'Pixelated', fontSize: '12px' }).setOrigin(0, 0.5);
        cardBox.container.add(cardBox.nameText);

        cardBox.countText = scene.add.text(160, 0, `x${val}`, { color: 'gray', fontFamily: 'Pixelated', fontSize: '12px' }).setOrigin(0, 0.5);
        cardBox.container.add(cardBox.countText);

        // When this card is clicked while hidden, show its ability
        cardBox.rect.on("pointerdown", () => {
            console.log(`Changed card to ${name}`)
            scene.cardSelector.changeCard(name);
        })
        // Allow the card's background to respond to click events
        cardBox.rect.setInteractive();
    }
}
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
        /*
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
        */

        this.player = this.registry.get('player');
        console.log(this.player);

        const collection = this.player.collection;
        let xOffset = 100;
        let count = 0;

        const scene = this;
        const boxes = [];

        const firstCard = Object.keys(collection.cards)[0];
        console.log(firstCard);
        scene.cardSelector = new Card(scene, 200, 300, firstCard, 0.25);
        

        for (const cardName in collection.cards) {
            count += 1;
            let val = collection.cards[cardName];
            console.log(`Card name is ${cardName}, number is ${val}`);

            let box = new CardBox(scene, 600, 25 + (count - 1) * 50, cardName, val);
            boxes.push(box);
            //for (let i = 0; i < val; i++) {
                //count += 1;
                //let card = new Card(scene, xOffset + count * 50, 175, cardName, 0.15);
            //}
        }
        console.log(boxes);

        const addCardButton = scene.add.rectangle(300, 400, 250, 75, 0x0000ff, 1).setOrigin(0.5, 0.5);
        addCardButton.setStrokeStyle(2, 0x000000, 1);

        addCardButton.on('pointerdown', () => {
            console.log("Added card!");
        })

        addCardButton.setInteractive();

        const removeCardButton = scene.add.rectangle(300, 500, 250, 75, 0xff0000, 1).setOrigin(0.5, 0.5);
        removeCardButton.setStrokeStyle(2, 0x000000, 1);

        removeCardButton.on('pointerdown', () => {
            console.log("Removed card!");
        })

        removeCardButton.setInteractive();


        //this.input.on('pointerdown', () => this.scene.start('match'))*/


    }
    update() {

    }
}

export default DeckScene;
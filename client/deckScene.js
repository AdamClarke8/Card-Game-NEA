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

        cardBox.cardCount = val;

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
            scene.selectedCard = name;
        })
        // Allow the card's background to respond to click events
        cardBox.rect.setInteractive();
    }

    changeCardCount(val) {
        const cardBox = this;
        cardBox.cardCount = val;
        cardBox.countText.text = `x${cardBox.cardCount}`
    }

    addToCardCount(val) {
        const cardBox = this;
        cardBox.cardCount += val;
        cardBox.countText.text = `x${cardBox.cardCount}`
    }

    removeFromCardCount(val) {
        const cardBox = this;
        cardBox.cardCount -= val;
        cardBox.countText.text = `x${cardBox.cardCount}`
    }

    getCardCount() {
        const cardBox = this;
        return cardBox.cardCount;
    }
}

class AddCardButton {
    constructor(scene, x, y) {

        const button = this;
        button.container = scene.add.container(x, y);

        button.rect = scene.add.rectangle(0, 0, 250, 75, 0x29b6f6, 1).setOrigin(0.5, 0.5);
        button.rect.setStrokeStyle(2, 0x000000, 1);
        button.container.add(button.rect);

        button.nameText = scene.add.text(0, 0, "ADD CARD", { color: 'black', fontFamily: 'Pixelated', fontSize: '18px' }).setOrigin(0.5, 0.5);
        button.container.add(button.nameText);

        // When the button is clicked, add one copy of the currently selected card to the player's deck
        button.rect.on("pointerdown", () => {
            let name = scene.selectedCard;
            if (name) {
                const cardBox = scene.cardBoxManager.getCardBox(name);
                const player = scene.player;
                if (player.deck.getNumCopies(name) == 4) {
                    console.log(`Player already has 4 copies of card named ${name} in their deck.`)
                }
                else if (cardBox.getCardCount() <= 0) {
                    console.log(`No more copies of ${name} available in player's collection`)
                }
                else {
                    console.log(`Added card ${name}`)
                    // add the card to deck
                    cardBox.removeFromCardCount(1);
                    scene.player.deck.addCard(name, 1);
                }
            }
            else {
                console.log("Player hasn't selected a card yet.");
            }
        })

        // Allow the button to respond to click events
        button.rect.setInteractive();
        console.log("Initialised add card button");
    }
}

class RemoveCardButton {
    constructor(scene, x, y) {

        const button = this;
        button.container = scene.add.container(x, y);

        button.rect = scene.add.rectangle(0, 0, 250, 75, 0xff0000, 1).setOrigin(0.5, 0.5);
        button.rect.setStrokeStyle(2, 0x000000, 1);
        button.container.add(button.rect);

        button.nameText = scene.add.text(0, 0, "REMOVE CARD", { color: 'black', fontFamily: 'Pixelated', fontSize: '18px' }).setOrigin(0.5, 0.5);
        button.container.add(button.nameText);

        // When the button is clicked, remove the currently selected card from the player's deck
        button.rect.on("pointerdown", () => {
            let name = scene.selectedCard;
            if (name) {
                const cardBox = scene.cardBoxManager.getCardBox(name);
                const player = scene.player;
                if (player.deck.getNumCopies(name) == 0) {
                    console.log(`Player has no copies of ${name} in their deck.`)
                }
                else {
                    console.log(`Added card ${name}`)
                    // remove the card from the deck
                    cardBox.addToCardCount(1);
                    scene.player.deck.removeCard(name, 1);
                }
            }
            else {
                console.log("Player hasn't selected a card yet.");
            }
        })

        // Allow the button to respond to click events
        button.rect.setInteractive();
        console.log("Initialised remove card button");
    }
}

class CardBoxManager {
    constructor(scene, x, y) {
        const manager = this;

        manager.scene = scene;
        manager.x = x;
        manager.y = y;

        manager.cardBoxList = {};
        manager.size = 0;
    }

    addCardBox(cardName, val) {
        const manager = this;
        console.log(`Attempting to add card box named ${cardName} with value ${val}`)
        let box = new CardBox(manager.scene, manager.x, manager.y + (manager.size - 1) * 50, cardName, val);
        manager.cardBoxList[cardName] = box;
        manager.size += 1;

    }

    getCardBox(cardName, val) {
        const manager = this;
        return manager.cardBoxList[cardName];
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

        const scene = this;
        scene.cardDatabase = new CardDatabase(scene);
        /* OLD
        scene.cardBoxManager = new CardBoxManager(scene);
        */
        // NEW
        scene.cardBoxManager = new CardBoxManager(scene, 600, 75);

        // Create a new instance of a zoom texture
        scene.rt = new ZoomTexture(scene, 400, 300, 800, 600);

        scene.player = scene.registry.get('player');

        const collection = scene.player.collection;
        let xOffset = 100;
        let count = 0;

        const boxes = [];

        const firstCard = Object.keys(collection.cards)[0];
        scene.cardSelector = new Card(scene, 200, 200, firstCard, 0.25);
        
        scene.player.deck.setNumCopies("elixir", 0);
        scene.player.collection.setNumCopies("elixir", 2);

        for (const cardName in collection.cards) {

            /* OLD
            count += 1;
            let val = collection.cards[cardName];
            console.log(`Card name is ${cardName}, number is ${val}`);

            let box = new CardBox(scene, 600, 25 + (count - 1) * 50, cardName, val);
            boxes.push(box);
            */

            // NEW

            let val = collection.cards[cardName];
            console.log(`Card name is ${cardName}, number is ${val}`);
            scene.cardBoxManager.addCardBox(cardName, val);

        }

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

    }
    update() {

    }
}

export default DeckScene;
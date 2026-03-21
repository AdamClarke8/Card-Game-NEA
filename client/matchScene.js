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
import ScreenFade from './screenFade.js'

import CardSlot from './cardSlot.js'
import Hand from './hand.js'
import Mulligan from './mulligan.js'

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
        const player = scene.player;

        const collection = player.collection;
        const deck = player.deck;
        player.initTempDeck();

        deck.displayDeck();
        // Initialise card database
        scene.cardDatabase = new CardDatabase(scene);
        // Create a new instance of a zoom texture
        scene.rt = new ZoomTexture(this, 400, 300, 800, 600);
        scene.screenFade = new ScreenFade(this, false);

        //const card = new Card(scene, 100, 200, "duckling", 0.125);

        const blueCardSlotVertices = [[100, 200], [250, 200], [400, 200], [550, 200], [700, 200]];
        const redCardSlotVertices = [[100, 400], [250, 400], [400, 400], [550, 400], [700, 400]];

        scene.cardSlots = [];

        for (let i = 0; i < blueCardSlotVertices.length; i++) {
            let vertex = blueCardSlotVertices[i];
            console.log(`Creating blue side vertex at: ${vertex}`);
            let cardSlot = new CardSlot(vertex[0], vertex[1], scene);
            scene.cardSlots.push(cardSlot);
        }

        for (let i = 0; i < redCardSlotVertices.length; i++) {
            let vertex = redCardSlotVertices[i];
            console.log(`Creating red side vertex at: ${vertex}`);
            let cardSlot = new CardSlot(vertex[0], vertex[1], scene);
            scene.cardSlots.push(cardSlot);
        }

        /*
        // Merge all card slots with background
        scene.cardSlots.forEach((cardSlot) => {
            cardSlot.container.setToBack();
        })
        */

        player.hand = new Hand(scene, player);
        player.mulligan = new Mulligan(scene, player);

        const hand = player.hand;
        const mulligan = player.mulligan;

        scene.screenFade.show();
        hand.initHand();
        mulligan.initMulliganDisplay();
        //hand.updateHandDisplay();

        this.backButton = this.add.text(400, 100, "BACK", { color: 'black', fontFamily: 'Pixelated', fontSize: '48px' }).setOrigin(0.5, 0.5);
        this.backButton.on("pointerdown", () => {
            scene.scene.start('home');
        })
        this.backButton.setInteractive();
    }

    update() {

    }

    confirmMulligan() {
        const scene = this;

        scene.player = scene.registry.get('player');
        const player = scene.player;
        const mulligan = player.mulligan;

        mulligan.cardObjects.forEach((cardObj) => {
            console.log(cardObj.container);
            cardObj.container.destroy();
        })

        mulligan.buttons.forEach((button) => {
            button.container.destroy();
        })

        scene.screenFade.hide();

        scene.startGame();
    }

    startGame() {
        const scene = this;
        const player = scene.player;
        const hand = player.hand;

        hand.updateHandDisplay();


        hand.cardObjects.forEach((cardObj) => {
            let container = cardObj.container;
            let rect = cardObj.bg;
            let width = rect.displayWidth;
            let height = rect.displayHeight;
            console.log(`${cardObj.cardName} ${container} ${rect} ${width} ${height}`)
            container.setInteractive(new Phaser.Geom.Rectangle(width * -0.5, height * -0.5, width, height), Phaser.Geom.Rectangle.Contains);
            scene.input.setDraggable(container);
            //scene.input.enableDebug(container);
        });

        // Assign card as being dragged on dragstart
        scene.input.on('dragstart', (pointer, gameObject) => {
            if (gameObject.cardObj) {
                scene.player.cardDragging = gameObject;
            }
        })

        // Set card's position while being dragged
        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject.cardObj) {
                let card = gameObject.cardObj;
                card.move(pointer.x, pointer.y);
            }
        });

        scene.input.on('dragend', (pointer, gameObject) => {
            if (gameObject.cardObj) {
                let origX = gameObject.input.dragStartX;
                let origY = gameObject.input.dragStartY;

                let dragX = pointer.x;
                let dragY = pointer.y;

                /*gameObject.x = origX;
                gameObject.y = origY;*/
                gameObject.cardObj.move(origX, origY, true);
                gameObject.setToTop();

                if (gameObject == scene.player.cardDragging) {
                    let card = gameObject.cardObj;
                    console.log(card.cardName);
                    scene.player.cardDragging = undefined;

                    console.log(`Pointer: x ${dragX} y ${dragY}`);
                    for (let i = 0; i < scene.cardSlots.length; i++) {
                        let cardSlot = scene.cardSlots[i];
                        let container = cardSlot.container;
                        let rect = cardSlot.bg;

                        let width = rect.displayWidth;
                        let height = rect.displayHeight;

                        //console.log(`Width: ${width}, height: ${height}`)
                        //console.log(`x: ${container.x}, y: ${container.y}`)

                        // Create a new rectangle whose area equals that of the card slot's background
                        let newRect = new Phaser.Geom.Rectangle(container.x - width * 0.5, container.y - height * 0.5, width, height);
                        // Check if the pointer is within bounds of the card slot's hit area (rectangle)
                        if (newRect.contains(dragX, dragY)) {
                            console.log(`Card being dragged over card slot is named ${card.cardName}`);
                            cardSlot.storeCard(card);
                            break
                        }
                    }

                }
            }
        })
    }
}

export default MatchScene;
import Card from './card.js'

import {
    sortByMana
} from './misc.js'

class MulliganButton {
    constructor(scene, x, y, mulligan, cardName) {
        const button = this;
        button.scene = scene;
        button.x = x;
        button.y = y;
        button.mulligan = mulligan;
        button.cardName = cardName;
        button.initButton();
    }

    initButton() {
        const button = this;
        const scene = button.scene;

        button.container = scene.add.container(button.x, button.y);

        button.rect = scene.add.rectangle(0, 0, 100, 50, 0x57b2c0, 1).setOrigin(0.5, 0.5);
        button.rect.setStrokeStyle(2, 0x000000, 1);
        button.container.add(button.rect);

        button.nameText = scene.add.text(0, 0, "SWAP OUT", { color: 'white', fontFamily: 'Pixelated', fontSize: '10px' }).setOrigin(0.5, 0.5);
        button.container.add(button.nameText);

        // When the button is clicked, add one copy of the currently selected card to the player's deck
        button.rect.on("pointerdown", () => {
            // swap card
            console.log(`Swapped card named ${button.cardName}`);
        })

        // Allow the button to respond to click events
        button.rect.setInteractive();
        console.log("Initialised add card button");
    }
}
class Mulligan {
    constructor(scene, player) {
        const mulligan = this;
        mulligan.scene = scene;
        mulligan.player = player;
        mulligan.cardObjects = [];
        mulligan.mulliganButtons = [];
        mulligan.container = scene.add.container(400, 300);
        console.log(`Successfully initialised mulligan of player named ${player.name}`)
    }

    initMulliganDisplay() {
        const mulligan = this;
        const hand = mulligan.player.hand;

        console.log(`Destroying existing cards in mulligan display of player named ${mulligan.player.name}`)

        /*
        // Destroy the existing cards in the user's mulligan display
        if (mulligan.cardObjects.length > 0) {
            // If there are cards in the hand to destroy, iterate through them...
            mulligan.cardObjects.forEach((cardObj) => {
                cardObj.destroy();
                console.log(`Destroyed card named ${cardObj.cardName}`)
            })
            mulligan.cardObjects = [];
        }
        else {
            console.log("No cards in hand to destroy");
        }
        */

        let cardNames = Object.keys(hand.cardsInHand.cards);


        let size = hand.cardsInHand.size;

        if (size != 5) {
            throw `Expected 5 cards in hand of player ${mulligan.player.name}: got ${size}`
        }

        console.log(`Size of hand is ${size}`);

        let count = 0;
        let scale = 0.175

        // Sort by ascending mana before displaying in mulligan
        console.log("Sorting cards in hand by mana before displaying...");
        cardNames = sortByMana(cardNames, mulligan.scene.cardDatabase);

        cardNames.forEach((cardName) => {
            console.log(`Card name is ${cardName}`)
            let numCopies = hand.cardsInHand.getNumCopies(cardName);
            for (let i = 0; i < numCopies; i++) {
                count += 1;
                // Offset cards so that they are centred
                let xOffset = -300 + ((count - 1) / (size - 1)) * 600
                var card = new Card(hand.scene, xOffset, 0, cardName, scale);
                mulligan.container.add(card.container);
                var button = new MulliganButton(hand.scene, xOffset, 125, mulligan, cardName);
                mulligan.container.add(button.container);
            }
        })
    }


}

export default Mulligan;
import Card from './card.js'

import {
    sortByMana
} from './misc.js'

class MulliganButton {
    constructor(scene, x, y, mulligan, card) {
        const button = this;
        button.scene = scene;
        button.x = x;
        button.y = y;
        button.mulligan = mulligan;
        button.card = card;
        button.initButton();
    }

    initButton() {
        const button = this;
        const scene = button.scene;
        const tempDeck = scene.player.tempDeck;
        const hand = scene.player.hand;

        button.container = scene.add.container(button.x, button.y);

        button.rect = scene.add.rectangle(0, 0, 100, 50, 0x57b2c0, 1).setOrigin(0.5, 0.5);
        button.rect.setStrokeStyle(2, 0x000000, 1);
        button.container.add(button.rect);

        button.nameText = scene.add.text(0, 0, "SWAP OUT", { color: 'white', fontFamily: 'Pixelated', fontSize: '10px' }).setOrigin(0.5, 0.5);
        button.container.add(button.nameText);

        // When the button is clicked, add one copy of the currently selected card to the player's deck
        button.rect.on("pointerdown", () => {
            // swap card
            let prevCardName = button.card.cardName;
            tempDeck.addCard(prevCardName);
            hand.cardsInHand.removeCard(prevCardName);
            let chosenCard = tempDeck.draw();
            hand.cardsInHand.addCard(chosenCard);

            button.card.changeCard(chosenCard);
            console.log(`Swapped card from ${prevCardName} to ${chosenCard}`);
            console.log(`Temp deck size: ${tempDeck.size}`)
            button.container.setVisible(false);

        })

        // Allow the button to respond to click events
        button.rect.setInteractive();
        console.log("Initialised add card button");
    }
}

class MulliganCompleteButton {
    constructor(scene, x, y, mulligan) {
        const button = this;
        button.scene = scene;
        button.x = x;
        button.y = y;
        button.mulligan = mulligan;
        button.initButton();
    }

    initButton() {
        const button = this;
        const scene = button.scene;

        button.container = scene.add.container(button.x, button.y);

        button.rect = scene.add.rectangle(0, 0, 150, 75, 0x32cd32, 1).setOrigin(0.5, 0.5);
        button.rect.setStrokeStyle(2, 0x000000, 1);
        button.container.add(button.rect);

        button.nameText = scene.add.text(0, 0, "CONFIRM", { color: 'black', fontFamily: 'Pixelated', fontSize: '12px' }).setOrigin(0.5, 0.5);
        button.container.add(button.nameText);

        // When the button is clicked, add one copy of the currently selected card to the player's deck
        button.rect.on("pointerdown", () => {
            // swap card
            scene.confirmMulligan();
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
        mulligan.buttons = [];
        mulligan.container = scene.add.container(400, 300);
        console.log(`Successfully initialised mulligan of player named ${player.name}`)
    }

    initMulliganDisplay() {
        const mulligan = this;
        const hand = mulligan.player.hand;

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

        // Add confirmation button
        let completeButton = new MulliganCompleteButton(hand.scene, 0, 200, mulligan);
        mulligan.container.add(completeButton.container);
        mulligan.buttons.push(completeButton);

        // Load mulligan cards
        cardNames.forEach((cardName) => {

            console.log(`Card name is ${cardName}`)
            let numCopies = hand.cardsInHand.getNumCopies(cardName);

            for (let i = 0; i < numCopies; i++) {
                count += 1;
                // Offset cards so that they are centred
                let xOffset = -300 + ((count - 1) / (size - 1)) * 600;

                // Add card object to mulligan list
                var card = new Card(hand.scene, xOffset, 0, cardName, scale);

                mulligan.container.add(card.container);
                mulligan.cardObjects.push(card);

                // Add mulligan button under card object
                var button = new MulliganButton(hand.scene, xOffset, 125, mulligan, card);
                mulligan.container.add(button.container);
                mulligan.buttons.push(button);
            }
        })

        // Make cards invisible for a short period of time (to prevent accidental click events)
        mulligan.cardObjects.forEach((cardObj) => {

            cardObj.container.setVisible(false);
            setTimeout(() => { cardObj.container.setVisible(true) }, 25);
        })
    }


}

export default Mulligan;
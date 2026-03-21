import Card from './card.js'

import {
    sortByMana
} from './misc.js'

class CardsInHand {
    constructor(scene, player) {
        const cardsInHand = this;
        cardsInHand.scene = scene;
        cardsInHand.player = player;
        cardsInHand.size = 0;
        cardsInHand.cards = {};
    }


    addCard(name, count = 1) {
        // If the card does not exist in the player's hand, add it as a new key-value pair
        if (this.cards[name] == undefined) {
            this.cards[name] = count;
        }
        else {
            this.cards[name] += count;
        }
        console.log(`Added ${count} copies of card named ${name} to hand of ${this.player.name}`)
        this.size += count;
    }

    removeCard(name, count = 1) {
        // If the card does not exist in the player's hand, throw an error
        if (this.cards[name] == undefined) {
            throw `Card ${name} not found in deck of Player ${this.player.name}`;
        }
        // Otherwise, if there are not enough copies to remove, throw an error
        else if (this.cards[name] - count < 0) {
            throw `Failed to remove ${count} copies of Card ${name} from hand of Player ${this.player.name}`;
        }
        else {
            this.cards[name] -= count;
        }
        this.size -= count;

        console.log(`Removed ${count} copies of card named ${name} from hand of ${this.player.name}`)
    }

    setNumCopies(name, count) {
        let diff = (count - this.cards[name]);
        this.size += diff;
        this.cards[name] = count;
        console.log(`Set copies of card named ${name} in hand of ${this.player.name} to ${count}`)

    }

    getNumCopies(name) {
        if (this.cards[name]) {
            return this.cards[name];
        }
        return 0;
    }

    displayHand() {
        console.log(`\nHand of player ${this.player.name}:\n`);
        // Display each card in the player's deck and number of copies for each card
        for (const [key, val] of Object.entries(this.cards)) {
            console.log(`${key}: ${val}`);
        }
        console.log(`\n`)
    }
}
class Hand {
    constructor(scene, player) {
        console.log(`Initialising hand of player named ${player.name}`);
        const hand = this;
        hand.scene = scene;
        hand.player = player;
        hand.cardsInHand = new CardsInHand(scene, player);
        hand.cardObjects = [];
        hand.container = scene.add.container(400, 525);
        console.log(`Successfully initialised hand of player named ${player.name}`)
    }

    initHand() {
        const hand = this;
        const tempDeck = hand.player.tempDeck;

        console.log(`Initialising cards for mulligan of player named ${hand.player.name}`)

        let size = tempDeck.size;
        if (size < 5) {
            throw `Not enough cards in deck of player named ${hand.player.name}`;
        }

        console.log("Drawing cards.");

        for (let i = 0; i < 5; i++) {
            let chosenCard = tempDeck.draw();
            hand.cardsInHand.addCard(chosenCard);
        }
    }

    updateHandDisplay() {
        // Destroy existing cards in hand and update with new ones
        const hand = this;
        const tempDeck = hand.player.tempDeck;

        console.log(`Destroying existing cards in hand of player named ${hand.player.name}`)

        // Destroy the existing cards in the user's hand
        if (hand.cardObjects.length > 0) {
            // If there are cards in the hand to destroy, iterate through them...
            hand.cardObjects.forEach((cardObj) => {
                cardObj.destroy();
                console.log(`Destroyed card named ${cardObj.cardName}`)
            })
            hands.cardObjects = [];
        }
        else {
            console.log("No cards in hand to destroy");
        }

        let cardNames = Object.keys(hand.cardsInHand.cards);

        if (!cardNames) {
            return;
        }

        let size = hand.cardsInHand.size;
        console.log(`Size of hand is ${size}`);

        let count = 0;
        let scale = 0.125

        // Sort by ascending mana before displaying in hand
        console.log("Sorting cards in hand by mana before displaying...");
        cardNames = sortByMana(cardNames, hand.scene.cardDatabase);

        cardNames.forEach((cardName) => {
            console.log(`Card name is ${cardName}`)
            let numCopies = hand.cardsInHand.getNumCopies(cardName);
            for (let i = 0; i < numCopies; i++) {
                count += 1;
                // Offset cards so that they are centred
                if (size == 1) {
                    var card = new Card(hand.scene, 0, 0, cardName, scale);
                }
                else {
                    var card = new Card(hand.scene, -200 + ((count - 1) / (size - 1)) * 400, 0, cardName, scale);
                }

                hand.container.add(card.container);
                hand.cardObjects.push(card);

            }
        })
        // Make cards invisible for a short period of time (to prevent accidental click events)
        hand.cardObjects.forEach((cardObj) => {
            cardObj.container.setVisible(false);
            setTimeout(() => { cardObj.container.setVisible(true) }, 50);
        })
    }
}

export default Hand;
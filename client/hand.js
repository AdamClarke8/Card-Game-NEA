import Card from './card.js'

import {
    sortByMana
} from './misc.js'
class Hand {
    constructor(scene, player) {
        console.log(`Initialising hand of player named ${player.name}`);
        const hand = this;
        hand.scene = scene;
        hand.player = player;
        hand.cardsInHand = {};
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
            if (hand.cardsInHand[chosenCard] == undefined) {
                hand.cardsInHand[chosenCard] = 1;
            }
            else {
                hand.cardsInHand[chosenCard] += 1;
            }
            //hand.cardsInHand.push(chosenCard);
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

        let cardNames = Object.keys(hand.cardsInHand);

        if (!cardNames) {
            return;
        }

        let size = 0;
        cardNames.forEach((cardName) => {
            size += hand.cardsInHand[cardName];
        })

        console.log(`Size of hand is ${size}`);

        let count = 0;
        let scale = 0.125

        // Sort by ascending mana before displaying in hand
        console.log("Sorting cards in hand by mana before displaying...");
        cardNames = sortByMana(cardNames, hand.scene.cardDatabase);

        cardNames.forEach((cardName) => {
            console.log(`Card name is ${cardName}`)
            let numCopies = hand.cardsInHand[cardName];
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
            }
        })
    }
}

export default Hand;
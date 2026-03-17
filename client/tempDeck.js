import Deck from './deck.js';
import {
    getRandomInt
} from './misc.js'

class TempDeck extends Deck {
    constructor(player) {
        super(player);
        const tempDeck = this;
        console.log("Initialising cards in temp deck");
        tempDeck.cards = Object.assign({}, player.deck.cards);
        tempDeck.size = player.deck.size;
        console.log(`Number of cards in temp deck is ${player.deck.size}`)
    }

    displayDeck() {
        const tempDeck = this;

        console.log(`\nTemp deck of player ${tempDeck.player.name}:\n`);
        // Display each card in the player's deck and number of copies for each card
        for (const [key, val] of Object.entries(tempDeck.cards)) {
            console.log(`${key}: ${val}`);
        }
        console.log(`\n`)
    }

    draw() {
        const tempDeck = this;

        let size = tempDeck.size;
        if (!size) {
            throw "No cards in the deck left to draw!"
        }

        let randNum = getRandomInt(0, size);
        console.log(`Random number is: ${randNum}`)
        let cardNames = Object.keys(tempDeck.cards);
        let count = 0;

        for (let i = 0; i < cardNames.length; i++) {
            let cardName = cardNames[i];
            let numCopies = tempDeck.cards[cardName];
            console.log(`Number of copies of ${cardName} is ${numCopies}`);
            count += numCopies;
            if (count > randNum) {
                console.log("Found card!");
                var chosenCardName = cardName;
                break;
            }
        }

        console.log(`Drew card named ${chosenCardName}`)
        tempDeck.removeCard(chosenCardName);
        return chosenCardName;
    }
}

export default TempDeck;
import Deck from './deck.js';

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
}

export default TempDeck;
class Deck {
    constructor(player) {
        const deck = this;

        this.player = player;
        this.size = 0;
        this.maxSize = 40;
        this.cards = {}

    }

    addCard(name, count = 1) {
        if (this.cards[name] == undefined) {
            this.cards[name] = count;
        }
        else {
            this.cards[name] += count;
        }
    }

    removeCard(name, count = 1) {
        if (this.cards[name] == undefined) {
            throw `Card ${name} not found in deck of Player ${this.player.name}`;
        }
        else if (this.cards[name] - count < 0) {
            throw `Failed to remove ${count} copies of Card ${name} from deck of Player ${this.player.name}`;
        }
        else {
            this.cards[name] -= count;
        }
    }

    displayDeck() {
        console.log(`Deck of player ${this.player.name}:`);
        for (const [key, val] of Object.entries(this.cards)) {
            console.log(key, val);
        }
    }
}

export default Deck;
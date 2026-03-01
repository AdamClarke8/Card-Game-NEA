class Collection {
    constructor(player) {
        const collection = this;

        this.player = player;
        this.size = 0;
        //this.maxSize = 40;
        this.cards = {};

    }

    addCard(name, count = 1) {
        // If the card does not exist in the player's collection, add it as a new key-value pair
        if (this.cards[name] == undefined) {
            this.cards[name] = count;
        }
        else {
            this.cards[name] += count;
        }
        console.log(`Added ${count} copies of card named ${name} to collection of ${this.player.name}`)
    }

    removeCard(name, count = 1) {
        // If the card does not exist in the player's collection, throw an error
        if (this.cards[name] == undefined) {
            throw `Card ${name} not found in collection of Player ${this.player.name}`;
        }
        // Otherwise, if there are not enough copies to remove, throw an error
        else if (this.cards[name] - count < 0) {
            throw `Failed to remove ${count} copies of Card ${name} from collection of Player ${this.player.name}`;
        }
        else {
            this.cards[name] -= count;
        }
        console.log(`Removed ${count} copies of card named ${name} from collection of ${this.player.name}`)
    }

    setNumCopies(name, count) {
        this.cards[name] = count;
        console.log(`Set copies of card named ${name} in collection of ${this.player.name} to ${count}`)
    }

    getNumCopies(name) {
        return this.cards[name];
    }

    displayCollection() {
        console.log(`\nCollection of player ${this.player.name}:\n`);
        // Display each card in the user's collection and number of copies of each card
        for (const [key, val] of Object.entries(this.cards)) {
            console.log(`${key}: ${val}`);
        }
        console.log(`\n`)
    }

}

export default Collection;
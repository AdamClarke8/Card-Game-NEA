import Deck from './deck.js'
import Collection from './collection.js'

class Player {
    constructor(name) {
        const player = this;

        player.name = name;
        player.health = 20;
        player.mana = 1;
        player.deck = new Deck(this);
        player.collection = new Collection(this);
    }

    setMana(value) {
        const player = this;
        player.mana = value;
        console.log(`Set mana of player ${player.name} to ${value}`);

    }
    setHealth(value) {
        const player = this;
        player.health = value;
        console.log(`Set health of player ${player.name} to ${value}`);
    }

    getMana() {
        const player = this;
        return player.mana;
    }
    getHealth() {
        const player = this;
        return player.health
    }

    displayPlayer() {
        const player = this;

        console.log(`\nName: ${player.name}`);
        console.log(`Health: ${player.health}`);

        console.log(`Mana: ${player.mana}`);
        player.collection.displayCollection();
        player.deck.displayDeck();

    }
}

export default Player;
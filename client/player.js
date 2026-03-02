import Deck from './deck.js'
import Collection from './collection.js'

class Player{
    constructor(name) {
        const player = this;

        this.name = name;
        this.health = 20;
        this.mana = 1;
        this.deck = new Deck(this);
        this.collection = new Collection(this);
    }

    setMana(value) {
        this.mana = value;
        console.log(`Set mana of player ${this.name} to ${value}`);

    }
    setHealth(value) {
        this.health = value;
        console.log(`Set health of player ${this.name} to ${value}`);
    }

    getMana() {
        return this.mana;
    }
    getHealth() {
        return this.health
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
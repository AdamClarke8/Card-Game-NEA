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
        console.log("Set mana to " + value);
    }
    setHealth(value) {
        this.health = value;
        console.log("Set health to " + value);
    }

}

export default Player;
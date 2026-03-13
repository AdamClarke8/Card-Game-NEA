import Card from './card.js'
class Hand {
    constructor(scene, player) {
        console.log(`Initialising hand of player named ${player.name}`);
        const hand = this;
        hand.scene = scene;
        hand.player = player;
        hand.cardsInHand = [];
        hand.container = scene.add.container(400, 525);
        console.log(`Successfully initialised hand of player named ${player.name}`)
    }
    updateHandDisplay() {
        // Destroy existing cards in hand and update with new ones
        const hand = this;
        const tempDeck = hand.player.tempDeck;

        console.log(`Destroying existing cards in hand of player named ${hand.player.name}`)
        // Destroy the existing cards in the user's hand
        if (hand.cardsInHand.length > 0) {
            // If there are cards in the hand to destroy, iterate through them...
            hand.cardsInHand.forEach((cardObj) => {
                cardObj.destroy();
                console.log(`Destroyed card named ${cardObj.cardName}`)
            })
            hands.cardsInHand = [];
        }
        else {
            console.log("No cards in hand to destroy");
        }

        let cardNames = Object.keys(tempDeck.cards);

        if (!cardNames) {
            return;
        }

        let size = tempDeck.size;
        console.log(`Size of deck is ${size}`);

        let count = 0;
        let scale = 0.125
        //let offset = scale / 2 * 690;
        cardNames.forEach((cardName) => {
            console.log(`Card name is ${cardName}`)
            let numCopies = tempDeck.cards[cardName];
            for (let i = 0; i < numCopies; i++) {
                count += 1;
                // Offset cards so that they are centred
                let card = new Card(hand.scene, -250 + ((count - 1) / (size - 1)) * 500, 0, cardName, scale);
                hand.cardsInHand.push(card);
                hand.container.add(card.container);
            }
        })
    }
}

export default Hand;
class AddCardButton {
    constructor(scene, x, y) {

        const button = this;
        button.container = scene.add.container(x, y);

        button.rect = scene.add.rectangle(0, 0, 250, 75, 0x29b6f6, 1).setOrigin(0.5, 0.5);
        button.rect.setStrokeStyle(2, 0x000000, 1);
        button.container.add(button.rect);

        button.nameText = scene.add.text(0, 0, "ADD CARD", { color: 'black', fontFamily: 'Pixelated', fontSize: '18px' }).setOrigin(0.5, 0.5);
        button.container.add(button.nameText);

        // When the button is clicked, add one copy of the currently selected card to the player's deck
        button.rect.on("pointerdown", () => {
            let name = scene.selectedCard;
            if (name) {
                const cardBox = scene.cardBoxManager.getCardBox(name);
                const player = scene.player;
                if (player.deck.getNumCopies(name) == 4) {
                    console.log(`Player named ${player.name} already has 4 copies of card named ${name} in their deck.`)
                }
                else if (cardBox.getCollectionCount() <= 0) {
                    console.log(`No more copies of card named ${name} available in collection of player named ${player.name}`)
                }
                else {
                    console.log(`Added 1 of card named ${name} to deck count of card box of ${player.name}`)
                    // add the card to deck
                    scene.player.deck.addCard(name, 1);
                    cardBox.addToCardCount(1);
                }
            }
            else {
                console.log("Player hasn't selected a card yet.");
            }
        })

        // Allow the button to respond to click events
        button.rect.setInteractive();
        console.log("Initialised add card button");
    }
}

class RemoveCardButton {
    constructor(scene, x, y) {

        const button = this;
        button.container = scene.add.container(x, y);

        button.rect = scene.add.rectangle(0, 0, 250, 75, 0xff0000, 1).setOrigin(0.5, 0.5);
        button.rect.setStrokeStyle(2, 0x000000, 1);
        button.container.add(button.rect);

        button.nameText = scene.add.text(0, 0, "REMOVE CARD", { color: 'black', fontFamily: 'Pixelated', fontSize: '18px' }).setOrigin(0.5, 0.5);
        button.container.add(button.nameText);

        // When the button is clicked, remove the currently selected card from the player's deck
        button.rect.on("pointerdown", () => {
            let name = scene.selectedCard;
            if (name) {
                const cardBox = scene.cardBoxManager.getCardBox(name);
                const player = scene.player;
                if (player.deck.getNumCopies(name) == 0) {
                    console.log(`Player has no copies of ${name} in their deck.`)
                }
                else {
                    console.log(`Removed 1 of card named ${name} from deck count of card box of ${player.name}`)
                    // remove the card from the deck
                    scene.player.deck.removeCard(name, 1);
                    cardBox.removeFromCardCount(1);
                }
            }
            else {
                console.log("Player hasn't selected a card yet.");
            }
        })

        // Allow the button to respond to click events
        button.rect.setInteractive();
        console.log("Initialised remove card button");
    }
}

export {
    AddCardButton,
    RemoveCardButton
}

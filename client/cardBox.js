import {
    sortCardList
} from "./misc.js"

class CardBox {
    constructor(scene, x, y, name, manager) {
        const cardBox = this;
        cardBox.scene = scene;
        cardBox.manager = manager;

        cardBox.deckCount = scene.player.deck.getNumCopies(name);
        cardBox.collectionCount = scene.player.collection.getNumCopies(name) - cardBox.deckCount;

        cardBox.container = scene.add.container(x, y);

        cardBox.rect = scene.add.rectangle(0, 0, 200, 50, 0xffffff, 1).setOrigin(0, 0.5);
        cardBox.rect.setStrokeStyle(2, 0x000000, 1);
        cardBox.container.add(cardBox.rect);

        cardBox.nameText = scene.add.text(10, 0, name, { color: 'black', fontFamily: 'Pixelated', fontSize: '12px' }).setOrigin(0, 0.5);
        cardBox.container.add(cardBox.nameText);


        cardBox.collectionCountText = scene.add.text(160, 0, `x${cardBox.collectionCount}`, { color: 'gray', fontFamily: 'Pixelated', fontSize: '12px' }).setOrigin(0, 0.5);
        cardBox.container.add(cardBox.collectionCountText);

        if (cardBox.deckCount == 0) {
            cardBox.deckCountText = scene.add.text(120, 0, "", { color: 'green', fontFamily: 'Pixelated', fontSize: '12px' }).setOrigin(0, 0.5);
        }
        else {
            cardBox.deckCountText = scene.add.text(120, 0, `x${cardBox.deckCount}`, { color: 'green', fontFamily: 'Pixelated', fontSize: '12px' }).setOrigin(0, 0.5);
        }

        cardBox.container.add(cardBox.deckCountText);

        // When this card is clicked while hidden, show its ability
        cardBox.rect.on("pointerdown", () => {
            if (scene.selectedCard != name) {
                if (scene.selectedCard) {
                    let prevCardName = scene.selectedCard;
                    let prevCardBox = scene.cardBoxManager.getCardBox(prevCardName);
                    prevCardBox.rect.setStrokeStyle(2, 0x000000, 1);
                }
                console.log(`Changed card to ${name}`);
                scene.cardSelector.changeCard(name);
                cardBox.rect.setStrokeStyle(4, 0x000000, 1);
                scene.selectedCard = name;
            }
            else {
                console.log(`Unselected card named ${name}`)
                //scene.cardSelector.changeCard(name);
                cardBox.rect.setStrokeStyle(2, 0x000000, 1);
                scene.selectedCard = null;
            }
        })
        // Allow the card's background to respond to click events
        cardBox.rect.setInteractive();
    }

    changeCardCount(val) {
        const cardBox = this;
        cardBox.deckCount = val;
        cardBox.collectionCount = cardBox.deckCount - val;
        cardBox.collectionCountText.text = `x${cardBox.collectionCount}`
        if (cardBox.deckCount == 0) {
            cardBox.deckCountText.text = ""
        }
        else {
            cardBox.deckCountText.text = `x${cardBox.deckCount}`
        }
        cardBox.manager.sortBoxes();
    }

    addToCardCount(val) {
        const cardBox = this;
        cardBox.deckCount += val;
        cardBox.collectionCount -= val;
        cardBox.collectionCountText.text = `x${cardBox.collectionCount}`
        cardBox.deckCountText.text = `x${cardBox.deckCount}`
        cardBox.manager.sortBoxes();
    }

    removeFromCardCount(val) {
        const cardBox = this;
        cardBox.deckCount -= val;
        cardBox.collectionCount += val;
        cardBox.collectionCountText.text = `x${cardBox.collectionCount}`
        if (cardBox.deckCount == 0) {
            cardBox.deckCountText.text = ""
        }
        else {
            cardBox.deckCountText.text = `x${cardBox.deckCount}`
        }
        cardBox.manager.sortBoxes();
    }

    getDeckCount() {
        const cardBox = this;
        return cardBox.deckCount;
    }

    getCollectionCount() {
        const cardBox = this;
        return cardBox.collectionCount;

    }
}
class CardBoxManager {
    constructor(scene, x, y) {
        const manager = this;
        manager.scene = scene;

        manager.scene = scene;
        manager.x = x;
        manager.y = y;

        manager.cardBoxList = {};
        manager.size = 0;
    }

    addCardBox(cardName, collectionCount, deckCount) {
        const manager = this;
        console.log(`Creating card box named ${cardName} with collection count ${collectionCount} and deck count ${deckCount}`)
        let box = new CardBox(manager.scene, manager.x, manager.y + (manager.size - 1) * 50, cardName, manager);
        manager.cardBoxList[cardName] = box;
        manager.size += 1;

    }

    getCardBox(cardName) {
        const manager = this;
        return manager.cardBoxList[cardName];
    }

    sortBoxes() {
        const manager = this;
        const cardNames = Object.keys(manager.cardBoxList);
        const newCardList = sortCardList(manager.scene.player, cardNames, manager.scene.cardDatabase);

        manager.size = 0;
        newCardList.forEach((cardName) => {
            manager.cardBoxList[cardName].container.y = manager.y + (manager.size - 1) * 50;
            manager.size += 1;
        })

        console.log("Sorted card boxes.")
    }
}

export {
    CardBox, CardBoxManager
}
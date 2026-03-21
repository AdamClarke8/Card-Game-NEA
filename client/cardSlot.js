class CardSlot {
    constructor(x, y, scene) {
        const slot = this;
        slot.scene = scene;

        slot.container = scene.add.container(x, y);
        slot.bg = scene.add.image(0, 0, 'cardSlot');
        slot.bg.setDisplaySize(80, 120);

        slot.container.add(slot.bg);
        slot.container.setToBack();

        // Set the slot's container to interactive so it can respond to click events
        let width = slot.bg.displayWidth;
        let height = slot.bg.displayHeight;

        //slot.container.setInteractive(new Phaser.Geom.Rectangle(width * -0.5, height * -0.5, width, height), Phaser.Geom.Rectangle.Contains);

        /*
        // Check if a card is being dragged over this card slot
        slot.container.on("pointerup", (pointer) => {

            console.log("Pointer was released over CardSlot");
            console.log(`Player: ${scene.player.name}, Card: ${scene.player.cardDragging}`)
            if (scene.player.cardDragging) {
                let card = scene.player.cardDragging.cardObj;
                console.log(`Card being dragged over card slot is named ${card.cardName}`);
            }
        });
        */
    }

    storeCard(card) {
        const slot = this;
        slot.card = card;
        console.log(`Slot location: ${slot.container.x} ${slot.container.y}`)
        console.log(`Card location: ${card.x} ${card.y}`)
        card.move(slot.container.x, slot.container.y);
        console.log(`New card location: ${card.x} ${card.y}`)
    }
}

export default CardSlot;
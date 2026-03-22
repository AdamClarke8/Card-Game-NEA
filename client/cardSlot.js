class CardSlot {
    constructor(x, y, scene) {
        const slot = this;
        slot.scene = scene;

        slot.container = scene.add.container(x, y);
        slot.bg = scene.add.image(0, 0, 'cardSlot');
        slot.bg.setDisplaySize(80, 120);

        slot.container.add(slot.bg);
        //slot.container.setToBack();

        // Assign the slot's container to the slot itself
        slot.container.slot = slot;

        // Set the slot's container to interactive so it can respond to click events
        let width = slot.bg.displayWidth;
        let height = slot.bg.displayHeight;

        //slot.container.setInteractive(new Phaser.Geom.Rectangle(width * -0.5, height * -0.5, width, height), Phaser.Geom.Rectangle.Contains);
    }

    storeCard(card) {
        const slot = this;
        const scene = slot.scene;

        slot.card = card;
        scene.player.hand.container.remove(card.container);
        slot.container.add(card.container);
        card.move(0, 0, true);
        //card.move(slot.container.x, slot.container.y);
    }
}

export default CardSlot;
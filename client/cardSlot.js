class CardSlot {
    constructor(x, y, scene) {
        const slot = this;
        slot.scene = scene;

        slot.container = scene.add.container(x, y);
        slot.bg = scene.add.image(0, 0, 'cardSlot');
        slot.bg.setDisplaySize(80, 120);

        slot.container.add(slot.bg);
        slot.container.setToBack();
    }
}

export default CardSlot;
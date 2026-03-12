class CardDatabase {
    constructor(scene) {
        this.data = scene.cache.json.get('cardData');
        this.scene = scene;
    }
    getCardInfo(name) {
        return this.data[name];
    }
    getCardAttribute(name, val) {
        return this.data[name][val];
    }
}

export default CardDatabase;
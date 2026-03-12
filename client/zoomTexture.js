import Phaser from 'phaser';
class ZoomTexture {
    constructor(scene, x, y, width, height) {

        const rt = this;
        // Create a new render texture, to which card containers can be drawn
        rt.rt = scene.add.renderTexture(x, y, width, height);
        rt.card = null
        rt.scene = scene;

        // If the zoom texture is clicked, hide the card that it is currently showing

        rt.rt.on("pointerdown", () => {
            const card = this.card;
            // If a card is assigned to the zoom texture, and this card is not already hidden, hide it
            if (card != null && !card.isHidden()) {
                rt.hideCard();
            }
        })

        // Allow the render texture to respond to click events
        rt.rt.setInteractive();
    }

    showCard(card) {
        // Method to show a card on the zoom texture

        console.log("Showing card.")
        const rt = this;
        const scene = rt.scene;
        rt.card = card;
        rt.rt.clear();

        card.x_temp = card.x;
        card.y_temp = card.y;
        card.x = 400;
        card.y = 300;
        // Update position of the card's container
        card.updateContainer();

        card.container.setScale(0.35);
        // Draw the container to the render texture as an image
        rt.rt.draw(card.container);
        // Bring the render texture to the front (highest priority for click events)
        rt.rt.setToTop();

        card.container.visible = false;
        scene.zoomed = true;
    }

    hideCard() {
        // Method to hide the current card on the zoom texture

        console.log("Hiding card.")

        const rt = this;
        const scene = this.scene;
        const card = this.card;

        // If the card exists
        if (card != null) {

            const card = this.card;
            
            card.container.setScale(card.scale);
            card.container.visible = true;
            rt.rt.clear();
            // Bring to back (lowest priority for click events)
            rt.rt.setToBack();

            card.x = card.x_temp;
            card.y = card.y_temp;
            // Update position of card's container
            card.updateContainer();

            card.hideAbility();
        }

        scene.zoomed = false;
    }
}

export default ZoomTexture;
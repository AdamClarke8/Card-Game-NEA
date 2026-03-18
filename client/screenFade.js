class ScreenFade {
    constructor(scene, show = false) {
        const screenFade = this;
        screenFade.graphics = scene.add.graphics();

        screenFade.graphics.fillStyle(0x000000, 0.5);
        screenFade.graphics.fillRect(0, 0, 800, 600);

        if (show) {
            screenFade.show();
        }
    }

    show() {
        const screenFade = this;
        screenFade.graphics.setVisible(true);
    }

    hide() {
        const screenFade = this;
        screenFade.graphics.setVisible(false);
    }

}

export default ScreenFade;
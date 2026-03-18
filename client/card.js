import Phaser from 'phaser';
import cardData from './assets/cardData.json';
import fontPixelated from './assets/fonts/default-pixilart-text.otf.woff2';
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js';

import CardDatabase from './cardDatabase.js'

class Card {
    constructor(scene, x, y, cardName, scale, abilityHidden = true) {
        console.log(`Creating card named ${cardName}`)
        const card = this;
        card.scene = scene;
        card.cardData = scene.cardDatabase.data;
        card.cardName = cardName;

        // Create container to store all card elements
        card.container = scene.add.container(x, y);

        // Load json file contents
        card.cardInfo = cardData[cardName];
        console.log(card.cardInfo);
        // Add card background
        card.addCardBackground();

        // Add name text
        card.addNameText();

        // Add ability text
        card.addAbilityText();

        // Add mana icon
        card.addManaIcon();

        // Add mana text at centre of mana icon
        card.addManaText();

        // Add card icon
        card.addCardIcon();

        // Add mana & atk icons (if the card is a Monster card)

        //if (card.cardInfo.type == "monster") {

        // Add atk icon and text
        //     card.addATKIcon();
        //     card.addATKText();

        // Add hp icon and text
        //    card.addHPIcon();
        //    card.addHPText();

        //}

        // Add hp & atk icons (these will be hidden if not a Monster card)

        card.addATKIcon();
        card.addATKText();

        card.addHPIcon();
        card.addHPText();
        console.log("Initialised all card sigils");

        // Scale up the container
        card.container.setScale(scale);
        card.scale = scale;

        // Store location of card
        card.x = x;
        card.y = y;
        card.x_temp = x;
        card.y_temp = y;

        let width = card.bg.displayWidth;
        let height = card.bg.displayHeight;

        // Allow the card's container to respond to click events
        card.container.setInteractive(new Phaser.Geom.Rectangle(width * -0.5, height * -0.5, width, height), Phaser.Geom.Rectangle.Contains);

        // When this card is clicked while hidden, show its ability
        card.container.on("pointerup", (pointer) => {

            // Negate if attempting to drag (mouse's distance from pointerdown position is beyond the threshold)
            let distance = pointer.getDistance();

            if (distance > 4) {
                return;
            }

            if (card.isHidden()) {
                card.showAbility();
            }
        })

        // Initially hide the card when first created
        if (abilityHidden) {
            card.hideAbility();
        }

        console.log("Card successfully created");
    }

    addCardBackground() {
        const card = this;
        card.bg = card.scene.add.image(0, 0, 'cardBackground');
        card.bg.depth = 1;

        card.container.add(card.bg);
    }

    addNameText() {

        const card = this;
        let xOffset = -200;
        let yOffset = -370;

        // Using pixelated font
        card.nameTxt = card.scene.add.text(xOffset, yOffset, card.cardInfo.name, { color: 'black', fontFamily: 'Pixelated', fontSize: '48px' });
        card.nameTxt.depth = 2;
        card.container.add(card.nameTxt);
    }

    formatAbilityText(text) {

        const re = /\+(\d+)\sATK/;
        const re2 = /\+(\d+)\sHP/;
        const re3 = /\-(\d+)\sATK/;
        const re4 = /\-(\d+)\sHP/;
        text = text.replace(re, "[color=green]+$1 ATK[/color]");
        text = text.replace(re2, "[color=green]+$1 HP[/color]");
        text = text.replace(re3, "[color=red]-$1 ATK[/color]");
        text = text.replace(re4, "[color=red]-$1 HP[/color]");
        return text

    }

    setAbilityText(text) {

        const card = this;
        // Format stat buffs and debuffs using colour codes

        text = this.formatAbilityText(text);
        card.abilityTxt.text = text;

    }

    addAbilityText() {

        const card = this;
        let xOffset = -200;
        let yOffset = 75;

        let abilityTxt = card.cardInfo.ability;

        if (abilityTxt) {
            abilityTxt = this.formatAbilityText(abilityTxt);
        }
        else {
            abilityTxt = "This card has no ability.";
        }

        // Using custom font and word wrapping

        card.abilityTxt = card.scene.add.rexBBCodeText({
            x: xOffset,
            y: yOffset,
            text: abilityTxt,
            style: {
                fontFamily: 'Pixelated',
                color: 'black',
                fontSize: '32px',
                wrap: {
                    mode: 'word',
                    width: 400
                }
            }
        });

        card.abilityTxt.depth = 2;

        // Enable word wrap-around
        var mode = card.abilityTxt.style.wrapMode;
        card.abilityTxt.setWrapMode(mode);
        // Set wrap width
        var width = card.abilityTxt.style.wrapWidth;
        card.abilityTxt.setWrapWidth(width);

        //if (!abilityTxt) {
        //    card.abilityTxt.visible = false;
        //}

        card.container.add(card.abilityTxt);
    }

    addManaIcon() {

        const card = this;
        let xOffset = 340;
        let yOffset = -500;

        card.manaIcon = card.scene.add.image(xOffset, yOffset, 'manaStar');
        card.manaIcon.setScale(1.75);
        card.manaIcon.depth = 2;
        card.container.add(card.manaIcon);

    }

    addManaText() {

        const card = this;
        let mana = card.cardInfo.mana
        // Using pixelated font
        card.manaTxt = card.scene.add.text(card.manaIcon.x, card.manaIcon.y, mana, { color: 'black', fontFamily: 'Pixelated', fontSize: '64px' }).setOrigin(0.5, 0.5);
        card.manaTxt.depth = 2;
        card.container.add(card.manaTxt);
    }

    addCardIcon() {

        const card = this;
        let name = card.cardInfo.name;
        let xOffset = 0;
        let yOffset = -75;
        card.cardIcon = card.scene.add.image(0, yOffset, name);
        card.cardIcon.setDisplaySize(360, 360);
        card.cardIcon.depth = 2;

        card.container.add(card.cardIcon);
    }

    addATKIcon() {
        const card = this;
        let xOffset = -300;
        let yOffset = 450;
        card.atkIcon = card.scene.add.image(xOffset, yOffset, 'atkSphere');
        card.atkIcon.setDisplaySize(560, 560);
        card.atkIcon.depth = 2;

        if (card.cardInfo.type != "monster") {
            card.atkIcon.visible = false;
        }

        card.container.add(card.atkIcon);
    }

    addHPIcon() {
        const card = this;
        let xOffset = 300;
        let yOffset = 450;
        card.hpIcon = card.scene.add.image(xOffset, yOffset, 'hpHeart');
        card.hpIcon.setDisplaySize(640, 640);
        card.hpIcon.depth = 2;

        if (card.cardInfo.type != "monster") {
            card.hpIcon.visible = false;
        }

        card.container.add(card.hpIcon);
    }

    addATKText() {
        const card = this;
        let attack = card.cardInfo.atk;
        // Using pixelated font
        card.atkTxt = card.scene.add.text(card.atkIcon.x + 15, card.atkIcon.y - 40, attack, { color: 'black', fontFamily: 'Pixelated', fontSize: '64px' }).setOrigin(0.5, 0.5);
        card.atkTxt.depth = 2;

        if (card.cardInfo.type != "monster") {
            card.atkTxt.visible = false;
        }

        card.container.add(card.atkTxt);
    }

    addHPText() {
        const card = this;
        let health = card.cardInfo.hp;
        // Using pixelated font
        card.hpTxt = card.scene.add.text(card.hpIcon.x + 15, card.hpIcon.y - 40, health, { color: 'black', fontFamily: 'Pixelated', fontSize: '64px' }).setOrigin(0.5, 0.5);
        card.hpTxt.depth = 2;

        if (card.cardInfo.type != "monster") {
            card.hpTxt.visible = false;
        }

        card.container.add(card.hpTxt);
    }

    changeCard(name) {
        const card = this;

        // Override previous card data with new card data
        let data = card.cardData[name];
        card.cardInfo = data;
        card.cardName = name;
        card.nameTxt.text = name;
        card.setAbilityText(data.ability);
        card.atkTxt.text = data.atk;
        card.hpTxt.text = data.hp;
        card.manaTxt.text = data.mana;
        card.cardIcon.setTexture(name);

        if (data.type == "monster") {
            card.atkIcon.visible = true;
            card.hpIcon.visible = true;
            card.atkTxt.visible = true;
            card.hpTxt.visible = true;
            //card.abilityTxt.visible = true;
        }
        else {
            card.atkIcon.visible = false;
            card.hpIcon.visible = false;
            card.atkTxt.visible = false;
            card.hpTxt.visible = false;
            //card.abilityTxt.visible = false;
        }
    }

    isHidden() {
        // Getter function that returns true if the card's ability is hidden, otherwise false
        const card = this;
        return card.abilityHidden;

    }

    hideAbility() {
        // Function to hide the ability of the card; throws an error if the ability is already hidden
        const card = this;
        const scene = this.scene
        const rt = this.scene.rt;

        if (!card.abilityHidden) {
            card.abilityHidden = true;
            console.log(rt);
            card.bg.setTexture('cardBackgroundNoAbility');
            card.abilityTxt.visible = false;
            card.cardIcon.y = card.bg.y + 75;
            card.cardIcon.setScale(card.cardIcon.scale * 1.75);
        }
        else {
            throw ("Card's ability is already hidden.");
        }
    }

    showAbility() {
        // Function to show the ability of the card; throws an error if the ability is already shown
        const card = this;
        const scene = this.scene;
        const rt = this.scene.rt;

        if (card.isHidden()) {
            card.abilityHidden = false;
            card.bg.setTexture('cardBackground');
            card.abilityTxt.visible = true;
            card.cardIcon.y = card.bg.y - 75;
            card.cardIcon.setScale(card.cardIcon.scale / 1.75);
            rt.showCard(card);
        }
        else {
            throw ("Card's ability is not hidden.");
        }
    }

    updateContainer() {
        // Update the position of the container to match the card's logical position
        const card = this;
        card.container.x = card.x;
        card.container.y = card.y;
    }
}

export default Card;
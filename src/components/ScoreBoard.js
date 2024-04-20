import { gameStore } from "../state/GameStore";
import { autorun } from "mobx";
import { observer } from "mobx-react";
import WebFont from "webfontloader";

export class ScoreBoard extends Phaser.GameObjects.Container {
  constructor(scene, x, y, lives, money) {
    super(scene, x, y);

    // Add the Electrolize font to the project
    WebFont.load({
      google: {
        families: ["Electrolize"],
      },
      active: function () {
        // Font is loaded and ready to use
      },
    });

    // Create volume up icon
    this.volume = scene.add.image(650,38,'volume_max').setScale(0.03).setInteractive({cursor:'pointer'})
    let isVolumeSwitch = true;

    this.volume.on('pointerdown',() => {
      if (isVolumeSwitch) {
        this.volume.setTexture('volume_mute');
        this.scene.sound.mute = true
    } else {
       this.volume.setTexture('volume_max');
       this.scene.sound.mute = !this.scene.sound.mute
    }
    isVolumeSwitch = !isVolumeSwitch;
    })

    // Create text objects to display lives and money
    this.moneyText = scene.add.text(0, 30, `MONEY: $${gameStore.money}`, {
      fontSize: "15px",
      fill: "#4DD4CA",
      fontFamily: "Electrolize",
    });

    this.lifeLabel = scene.add.text(-125, 30, `Life: `, {
      fontSize: "15px",
      fill: "#4DD4CA",
      fontFamily: "Electrolize",
    });

    this.waveText = scene.add.text(10, 30, `WAVE: ${gameStore.wave}`, {
      fontSize: "15px",
      fill: "#4DD4CA",
      fontFamily: "Electrolize",
    });

    this.enemyText = scene.add.text(-720, 30, `Enemies: ${gameStore.enemies}`, {
      fontSize: "15px",
      fill: "#4DD4CA",
      fontFamily: "Electrolize",
    });

    this.healthBarOutline = scene.add
      .rectangle(-90, 45, 78, 13)
      .setOrigin(0, 1);

    this.healthBarOutline.setStrokeStyle(1, 0x4dd4ca);

    this.healthBar = scene.add
      .rectangle(-89, 45, 80, 15, 0x4dd4ca)
      .setOrigin(0, 1);

    // Add the text objects to the container
    this.add(this.healthBarOutline);

    this.add(this.healthBar);

    this.add(this.moneyText);

    this.add(this.lifeLabel);

    this.add(this.enemyText);

    // Add the container to the scene
    //this.setSize(200, 50);
    this.setX(800);
    scene.add.existing(this);

    this.disposer = autorun(() => {
      this.moneyText.setText(`Money: $${gameStore.money}`);
      this.waveText.setText(`Wave: ${gameStore.wave}`);
      this.enemyText.setText(`Enemies: ${gameStore.enemies}`);
      const percentage = gameStore.life_bar; // Assuming life_bar is a percentage (0-100)
      const width = (76 * percentage) / 100; // Adjusting the width of the bar based on the percentage
      this.healthBar.setSize(width, 12);
      //console.log(gameStore.life_bar)
    });
  }

  destroy() {
    this.disposer();
    super.destroy();
  }
}

export default observer(ScoreBoard);

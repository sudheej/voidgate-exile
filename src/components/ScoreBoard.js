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

    // Create text objects to display lives and money
    this.moneyText = scene.add.text(0, 30, `MONEY: $${gameStore.money}`, {
      fontSize: "15px",
      fill: "#4DD4CA",
      fontFamily: "Electrolize",
    });

    this.waveText = scene.add.text(10, 30, `WAVE: ${gameStore.wave}`, {
      fontSize: "15px",
      fill: "#4DD4CA",
      fontFamily: "Electrolize",
    });
    
    this.enemyText = scene.add.text(80, 30, `Enemies: ${gameStore.enemies}`, {
      fontSize: "15px",
      fill: "#4DD4CA",
      fontFamily: "Electrolize",
    });
    // Add the text objects to the container
    this.add(this.moneyText);

    // Add the container to the scene
    //this.setSize(200, 50);
    this.setX(800);
    scene.add.existing(this);

    this.disposer = autorun(() => {
      this.moneyText.setText(`Money: $${gameStore.money}`);
      this.waveText.setText(`Wave: ${gameStore.wave}`);
      this.enemyText.setText(`Enemies: ${gameStore.enemies}`);
    });
  }

  destroy() {
    this.disposer();
    super.destroy();
  }
}

export default observer(ScoreBoard);

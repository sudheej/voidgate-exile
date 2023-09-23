import { gameStore } from "../state/GameStore";
import { autorun } from "mobx";
import { observer } from "mobx-react";
export class ScoreBoard extends Phaser.GameObjects.Container {
  constructor(scene, x, y, lives, money) {
    super(scene, x, y);

    // Create text objects to display lives and money
    //this.livesText = scene.add.text(0, 0, `Lives: ${lives}`, { fontSize: '24px', fill: '#FFF' });
    this.moneyText = scene.add.text(0, 30, `Money: ${gameStore.money}`, {
      fontSize: "24px",
      fill: "#FFF",
    });

    this.waveText = scene.add.text(10, 30, `Wave: ${gameStore.wave}`, {
      fontSize: "24px",
      fill: "#FFF",
    });

    // Add the text objects to the container
    //this.add(this.livesText);
    this.add(this.moneyText);

    // Add the container to the scene

    this.setSize(200, 50);
    this.setX(800);
    scene.add.existing(this);

    this.disposer = autorun(() => {
      this.moneyText.setText(`Money: ${gameStore.money}`);
      this.waveText.setText(`Wave: ${gameStore.wave}`);
    });
  }

  destroy() {
    this.disposer();
    super.destroy();
  }
}

export default observer(ScoreBoard);

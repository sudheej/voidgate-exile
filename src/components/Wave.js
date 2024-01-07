import enemy_list from "../assets/entities/enemys.json";
import Enemy from "./Enemy";
import { gameStore } from "../state/GameStore";
import ModalDialog from "./Ui/ModalDialog";

export default class Wave {
  constructor(scene) {
    this.scene = scene;
    this.wave = 1;
    this.currentEnemies = [];
    this.wavestart = false;
  }

  createWave(enemyPath) {
    let currentCount = 5;
    let maxCount = 50;
    const randomIndex = Math.floor(Math.random() * enemy_list.length);
    let TotalCount = currentCount * gameStore.wave;
    if (TotalCount < maxCount) {
      this.wavestart = false;
      this.createEnemies(enemy_list[randomIndex], TotalCount, enemyPath);
    } else {
      const message = "All waves completed, Killed " + TotalCount
      const modalDialog = new ModalDialog(this.scene)
      modalDialog.createDialog(message)

    }
  }

  createEnemies(enemyDetails, count, enemyPath) {
    this.timedEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        const enemy = new Enemy(this.scene);
        enemy.createEnemyWithPath(enemyPath, enemyDetails);
        this.currentEnemies.push(enemy);
        this.wavestart = true;
      },
      callbackScope: this,
      repeat: count,
    });
  }

  updateEnemyStatus() {
    this.currentEnemies = this.currentEnemies.filter((enemy) => {
      if (enemy.health <= 0) {
        // Remove the enemy from the scene or perform any other cleanup
        //enemy.destroy(); // For example, if Phaser's GameObject, you can destroy it
        return false; // Exclude the enemy from the updated array
      }
      return true; // Keep the enemy in the updated array
    });
  }
}

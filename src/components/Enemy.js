export default class Enemy {
    constructor(scene) {
      this.scene = scene;
      this.path = null;
      this.tweenProgress = 0;
    }
  
    createEnemyWithPath(pathCoordinates, enemy) {
      this.path = new Phaser.Curves.Path(pathCoordinates[0].x, pathCoordinates[0].y);
      for (let i = 1; i < pathCoordinates.length; i++) {
        this.path.lineTo(pathCoordinates[i].x, pathCoordinates[i].y);
      }
  
      enemy.setName("enemy");
  
      this.scene.tweens.add({
        targets: enemy,
        angle: 360,
        duration: 2000,
        repeat: -1,
        ease: "Linear",
      });
  
      this.scene.tweens.add({
        targets: { progress: 1 },
        ease: "Linear",
        duration: 5000,
        repeat: -1,
        yoyo: false,
      });
  
      this.scene.time.addEvent({
        delay: 30,
        loop: true,
        callback: () => {
          this.tweenProgress += 0.003;
          if (this.tweenProgress > 1) {
            this.tweenProgress -= 1;
          }
          const position = this.path.getPoint(this.tweenProgress);
          enemy.setPosition(position.x, position.y);
        },
      });
    }
  
    get enemyData() {
      return EnemyData;
    }
  
    set enemyData(value) {
      EnemyData = value;
    }
  }
  
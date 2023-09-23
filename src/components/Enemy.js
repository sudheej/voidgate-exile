import Helper from "../utilities/Helper";
import { Game } from "phaser";
import { gameStore } from "../state/GameStore";
export default class Enemy {
  constructor(scene) {
    this.scene = scene;
    this.path = null;
    this.tweenProgress = 0;
    this.helper = new Helper();
    this.health = 100;
    this.enemyAvatar = null;
    this.particles = this.scene.add.particles("spark");
  }

  createEnemy(scene, enemyObject, enemyPath) {
    let enemyShape;

    let fillColor = parseInt(enemyObject.fillColor.slice(1), 16) || 0xffffff; // default fill color is white
    const PATH_START_X = enemyPath[0].x;
    const PATH_START_Y = enemyPath[0].y;
    const HEALTH_BAR_HEIGHT = 3; // height of the health bar

    switch (enemyObject.shape) {
      case "rectangle":
        enemyShape = scene.add.rectangle(
          PATH_START_X,
          0,
          enemyObject.width,
          enemyObject.height,
          fillColor
        );
        break;
      case "circle":
        enemyShape = scene.add.circle(
          PATH_START_X,
          PATH_START_Y,
          this.helper.calculateRadius(enemyObject.height, enemyObject.width),
          fillColor
        );
        break;
      case "triangle":
        enemyShape = scene.add.triangle(
          PATH_START_X,
          PATH_START_Y,
          -25,
          50,
          25,
          50,
          fillColor
        );
        break;
      // add cases for other supported shapes if needed
      default:
        console.error(`Unsupported shape type: ${enemyObject.shape}`);
        return null; // return null if the shape type is not supported
    }

    enemyShape.name = enemyObject.name || "Enemy";
    enemyShape.speed = enemyObject.speed || 1;
    //enemyShape.rotation = !!enemyObject.rotation; // convert the boolean value to a boolean type

    // add a health bar on top of the enemy shape
    const healthBar = scene.add.rectangle(
      enemyShape.x,
      enemyShape.y - enemyShape.height / 2 - HEALTH_BAR_HEIGHT,
      enemyShape.width,
      HEALTH_BAR_HEIGHT,
      0x00ff00 // red color for the health bar
    );
    healthBar.setOrigin(0.5, 0);
    healthBar.setScale(this.health / 100, 1);

    enemyShape.health = 100;

    // add the health bar as a property of the enemy shape so it can be accessed later
    enemyShape.healthBar = healthBar;

    enemyShape.decreaseHealth = (value) => {
      enemyShape.health = Math.max(0, enemyShape.health - value);
      enemyShape.healthBar.setScale(enemyShape.health / 100, 1);
    };

    enemyShape.destroyEnemy = () => {
      const emitZone = new Phaser.Geom.Polygon(enemyShape.geom.getPoints());

      const emitterConfig = {
        x: enemyShape.x,
        y: enemyShape.y,
        scale: { start: 0.05, end: 0 },
        speed: { min: -100, max: 100 },
        quantity: 50,
        lifespan: 400,
        blendMode: "SCREEN",
      };

      const emitter = this.particles.createEmitter(emitterConfig);
      emitter.explode();
      this.health = 0;
      this.increaseMoney();
    };

    return enemyShape;
  }

  increaseMoney() {
    gameStore.money += 20;
  }

  createEnemyWithPath(pathCoordinates, enemyObject) {
    this.enemyAvatar = this.createEnemy(
      this.scene,
      enemyObject,
      pathCoordinates
    );

    this.path = new Phaser.Curves.Path(
      pathCoordinates[0].x,
      pathCoordinates[0].y
    );
    for (let i = 1; i < pathCoordinates.length; i++) {
      this.path.lineTo(pathCoordinates[i].x, pathCoordinates[i].y);
    }

    this.enemyAvatar.setName("enemy");
    if (enemyObject.rotation) {
      this.scene.tweens.add({
        targets: this.enemyAvatar,
        angle: 360,
        duration: 2000,
        repeat: -1,
        ease: "Linear",
      });
    }

    this.scene.tweens.add({
      targets: { progress: 1 },
      ease: "Linear",
      duration: 5000,
      repeat: -1,
      yoyo: false,
    });

    this.scene.time.addEvent({
      delay: 3 * enemyObject.speed,
      loop: true,
      callback: () => {
        this.tweenProgress += 0.003;
        if (this.tweenProgress > 1) {
          this.tweenProgress -= 1;
        }
        const position = this.path.getPoint(this.tweenProgress);
        this.enemyAvatar.setPosition(position.x, position.y);
        this.enemyAvatar.healthBar.setPosition(position.x, position.y - 10);
        // if (this.health > 0) {
        //     this.health = this.health - 1
        //     this.enemyAvatar.healthBar.setScale(this.health/100, 1);
        // }
      },
    });
  }

  get enemyHealth() {
    return this.health;
  }

  get enemyData() {
    return EnemyData;
  }

  set enemyData(value) {
    EnemyData = value;
  }
}

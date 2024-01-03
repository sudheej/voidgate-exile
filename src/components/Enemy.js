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
        // scene.add.triangle()
        enemyShape = scene.add.triangle(
          PATH_START_X, // X coordinate of the first point (top)
          PATH_START_Y, // Y coordinate of the first point (top)
          0, // X coordinate of the second point (bottom-left)
          10, // Y coordinate of the second point (bottom-left)
          10, // X coordinate of the third point (bottom-right)
          10, // Y coordinate of the third point (bottom-right)
          5, // X coordinate of the fourth point (top-middle)
          0, // Y coordinate of the fourth point (top-middle)
          fillColor
        );
        /*       enemyShape = scene.add.triangle(
          PATH_START_X,
          PATH_START_Y,
          -25,
          50,
          25,
          50,
          fillColor
        ); */
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

    enemyShape.stun = (duration) => {
      enemyShape.setData("stunned", true);
      const startTime = performance.now();
      const animate = (currentTime) => {
        if (currentTime - startTime >= duration) {
          enemyShape.setData("stunned", false);
        } else {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };

    enemyShape.destroyEnemy = () => {
      //const emitZone = new Phaser.Geom.Polygon(enemyShape.geom.getPoints());
      if (enemyShape !== null) {
        const emitter = this.scene.add.particles(
          enemyShape.x,
          enemyShape.y,
          "spark",
          {
            scale: { start: 0.06, end: 0 },
            speed: { min: 100, max: 150 },
            quantity: 50,
            lifespan: 400,
            blendMode: "ADD",
            emitting: true,
          }
        );
        this.scene.audio.play("_aud_explosion");
        enemyShape ? emitter.explode() : "";
      }

      //this.scene.cameras.main.shake(100,0.001)
      this.health = 0;
      this.increaseMoney();
    };

    return enemyShape;
  }

  increaseMoney() {
    gameStore.money += 20;
  }

  decreaseHealth(difficulty) {
    //const computedLoss = gameStore.wave * difficulty;
    if (gameStore.life_bar > 1) {
      gameStore.life_bar -= 1;
      this.scene.audio.play("_aud_hurt");
    }
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
      delay: 4 * enemyObject.speed,
      loop: true,
      callback: () => {
        if (!this.enemyAvatar.getData("stunned")) {
          this.tweenProgress += 0.003;
          if (this.tweenProgress > 1) {
            this.tweenProgress -= 1;

            //console.log("igot fired")
            this.decreaseHealth(enemyObject.difficulty);
          }
          const position = this.path.getPoint(this.tweenProgress);

          this.enemyAvatar.setPosition(position.x, position.y);
          this.enemyAvatar.healthBar.setPosition(position.x, position.y - 10);

          //console.log(position)
        }
        if (this.health <= 0) {
          this.tweenProgress = 0;
        }
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

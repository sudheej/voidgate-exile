import Helper from '../utilities/Helper'
export default class Enemy {
  constructor(scene) {
    this.scene = scene;
    this.path = null;
    this.tweenProgress = 0;
    this.helper = new Helper()
  }

 createEnemy(scene, enemyObject, enemyPath) {
    let enemyShape;
    let fillColor = parseInt(enemyObject.fillColor.slice(1), 16) || 0xffffff; // default fill color is white
    const PATH_START_X = enemyPath[0].x
    const PATH_START_Y = enemyPath[0].y
    switch (enemyObject.shape) {
      case 'rectangle':
        enemyShape = scene.add.rectangle(PATH_START_X, 0, enemyObject.width, enemyObject.height,fillColor);
        break;
      case 'circle':
        enemyShape = scene.add.circle(PATH_START_X,  PATH_START_Y, this.helper.calculateRadius(enemyObject.height,enemyObject.width), fillColor);
        break;
      case 'triangle':
        enemyShape = scene.add.triangle(PATH_START_X, PATH_START_Y, -25, 50, 25, 50, fillColor);
        break;
      // add cases for other supported shapes if needed
      default:
        console.error(`Unsupported shape type: ${enemyObject.shape}`);
        return null; // return null if the shape type is not supported
    }
  
    enemyShape.name = enemyObject.name || "Enemy";
    enemyShape.speed = enemyObject.speed || 1;
    //enemyShape.rotation = !!enemyObject.rotation; // convert the boolean value to a boolean type
    return enemyShape;
  }

  createEnemyWithPath(pathCoordinates, enemyObject) {

    const enemy = this.createEnemy(this.scene,enemyObject,pathCoordinates)

    this.path = new Phaser.Curves.Path(
      pathCoordinates[0].x,
      pathCoordinates[0].y
    );
    for (let i = 1; i < pathCoordinates.length; i++) {
      this.path.lineTo(pathCoordinates[i].x, pathCoordinates[i].y);
    }

    enemy.setName("enemy");
if(enemyObject.rotation) {
    this.scene.tweens.add({
        targets: enemy,
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

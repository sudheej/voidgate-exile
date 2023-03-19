export default function Enemy(scene) {
  this.createEnemyWithPath = function (pathCoordinates, enemy) {
    var points = pathCoordinates;
    // Create a new path object
    var path = new Phaser.Curves.Path(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
      path.lineTo(points[i].x, points[i].y);
    }
    var tweenProgress = 0;

    //var particles = scene.add.particles('particle_texture');

    // Create an emitter for the particles

    enemy.setName("enemy");
    enemy.name = "enemy";

    scene.tweens.add({
      targets: enemy,
      angle: 360,
      duration: 2000,
      repeat: -1,
      ease: "Linear",
    });

    scene.tweens.add({
      targets: { progress: 1 },
      ease: "Linear",
      duration: 5000,
      repeat: -1,
      yoyo: false,
    });
    scene.time.addEvent({
      delay: 30,
      loop: true,
      callback: function () {
        tweenProgress += 0.003; // Increment the progress by the time elapsed since last update (16ms)
        if (tweenProgress > 1) {
          tweenProgress -= 1; // Loop back to the beginning of the path
        }
        var position = path.getPoint(tweenProgress);
        enemy.setPosition(position.x, position.y);
      },
    });
  };

  // function particleEffect() {
  //     var emitter = particles.createEmitter({
  //         x: position.x,
  //         y: position.y,
  //         lifespan: 2000,
  //         speed: { min: 100, max: 200 },
  //         angle: 360,
  //         gravityY: 200,
  //         scale: { start: 1, end: 0 },
  //         blendMode: 'ADD',
  //         tint: [enemy.fillColor]
  //     });
  // }

  Object.defineProperty(this, "EnemyData", {
    get: function () {
      return EnemyData;
    },
    set: function (value) {
      EnemyData = value;
    },
  });
}

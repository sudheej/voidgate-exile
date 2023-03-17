export default function Path(scene) {
  let PathData;


  function drawLine(points) {
    const graphics = scene.add.graphics();

    // define the line color and width
    graphics.lineStyle(2, 0xffffff);

    // move the graphics object to the starting point of the line
    graphics.moveTo(points[0].x, points[0].y);

    // loop through the remaining points in the array and draw lines between them
    for (let i = 1; i < points.length; i++) {

      graphics.lineTo(points[i].x, points[i].y);
    }

    // render the graphics object
    graphics.strokePath();
  }



  function createEnemyWithPath(coordinates,enemy) {
    // Parse the JSON data
    //var points = JSON.parse(coordinates);

    var points = coordinates;

    // Create a new path object
    var path = new Phaser.Curves.Path(points[0].x, points[0].y);

    // Add points to the path
    for (var i = 1; i < points.length; i++) {
        path.lineTo(points[i].x, points[i].y);
    }

    // Create the enemy object as a shape
    

    // Create a variable to store the progress of the tween
    var tweenProgress = 0;

    // Set up the update function for the tween
    scene.tweens.add({
        targets: { progress: 1 },
        ease: 'Linear',
        duration: 2000,
        repeat: -1,
        yoyo: true
    });

    // Update the position of the enemy object based on the progress of the tween
    scene.time.addEvent({
        delay: 160,
        loop: true,
        callback: function () {
            tweenProgress += 0.016; // Increment the progress by the time elapsed since last update (16ms)
            if (tweenProgress > 1) {
                tweenProgress -= 1; // Loop back to the beginning of the path
            }
            var position = path.getPoint(tweenProgress);
            enemy.setPosition(position.x, position.y);
        }
    });
}



 

  this.createPath = function (MappingData) {
    console.log(PathData[0]);
  
    var enemy = scene.add.rectangle(PathData[0][0].x, PathData[0][0].y, 10, 10, 0x0000ff);

    // Draw a shape

    createEnemyWithPath(PathData[0],enemy)

    // use below to debug path followed by enemy
    //drawLine(PathData[0]);
  };


  Object.defineProperty(this, "PathData", {
    get: function () {
      return PathData;
    },
    set: function (value) {
      PathData = value;
    },
  });
}

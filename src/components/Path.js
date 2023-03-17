export default function Path(scene) {
  let PathData;

  function drawLine(points) {
    const graphics = scene.add.graphics();
    graphics.lineStyle(2, 0xffffff);
    graphics.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i].x, points[i].y);
    }
    graphics.strokePath();
  }

  this.createPath = function (MappingData) {
    // var enemy = scene.add.rectangle(
    //   PathData[0][0].x,
    //   PathData[0][0].y,
    //   10,
    //   10,
    //   0x0000ff
    // );
    // createEnemyWithPath(PathData[0], enemy);
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

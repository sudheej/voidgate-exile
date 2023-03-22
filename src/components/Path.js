export default class Path {
  constructor(scene) {
    this.scene = scene;
    this.pathData = null;
  }

  drawLine(points) {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(2, 0xffffff);
    graphics.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i].x, points[i].y);
    }
    graphics.strokePath();
  }

  get PathData() {
    return this.pathData;
  }

  set PathData(value) {
    this.pathData = value;
  }
}

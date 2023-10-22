import Helper from "../utilities/Helper";

export default class Pretty {
  constructor(scene) {
    this.scene = scene;
    this.helper = new Helper();
  }

  scanDirection(rectangle, rectangles) {
    const top = rectangles.filter(
      (r) => r.y === rectangle.y - rectangle.height && r.x === rectangle.x
    );
    const left = rectangles.filter(
      (r) => r.x === rectangle.x - rectangle.width && r.y === rectangle.y
    );
    const right = rectangles.filter(
      (r) => r.x === rectangle.x + rectangle.width && r.y === rectangle.y
    );
    const bottom = rectangles.filter(
      (r) => r.y === rectangle.y + rectangle.height && r.x === rectangle.x
    );
    return { top, left, right, bottom };
  }
  makeTilesPretty() {
    let rectangles = [];
    let adjacentRectangles = [];

    if (this.scene.sys.displayList instanceof Phaser.GameObjects.DisplayList) {
      rectangles = this.scene.sys.displayList.list.filter(
        (child) => child instanceof Phaser.GameObjects.Rectangle
      );
    }

    rectangles.forEach((rectangle) => {
      if (rectangle.name === "plain") {
        const adjacentRectangles = this.scanDirection(rectangle, rectangles);
        for (const direction in adjacentRectangles) {
          if (adjacentRectangles[direction].length === 0) {
            const prettyLine = this.scene.add.graphics();
            prettyLine.lineStyle(1, this.helper.adjustShade(0x4dd4ca, 20)); // Use a function to determine the line color
            prettyLine.beginPath();

            let startX, startY, endX, endY;

            switch (direction) {
              case "left":
                startX = endX = rectangle.x - rectangle.width / 2;
                startY = rectangle.y - rectangle.height / 2;
                endY = startY + rectangle.height;
                break;

              case "right":
                startX = endX = rectangle.x + rectangle.width / 2;
                startY = rectangle.y - rectangle.height / 2;
                endY = startY + rectangle.height;
                break;

              case "top":
                startY = endY = rectangle.y - rectangle.height / 2;
                startX = rectangle.x - rectangle.width / 2;
                endX = startX + rectangle.width;
                break;

              case "bottom":
                startY = endY = rectangle.y + rectangle.height / 2;
                startX = rectangle.x - rectangle.width / 2;
                endX = startX + rectangle.width;
                break;
            }

            prettyLine.moveTo(startX, startY);
            prettyLine.lineTo(endX, endY);
            prettyLine.strokePath();
          }
        }
      }
    });
  }
}

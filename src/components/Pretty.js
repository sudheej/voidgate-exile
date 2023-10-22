export default class Pretty {
    constructor(scene) {
      this.scene = scene;
    }
  
    makeTilesPretty() {
        let rectangles = [];

        if (this.scene.sys.displayList instanceof Phaser.GameObjects.DisplayList) {
          rectangles = this.scene.sys.displayList.list.filter(
            (child) => child instanceof Phaser.GameObjects.Rectangle
          );
        }
        
        rectangles.forEach((rectangle) => {
          if(rectangle.name === "plain") {
            console.log(`x: ${rectangle.x}, y: ${rectangle.y}`);
            console.log(rectangle)

          }  
  
        });
        
        
  }
}
  
import Phaser from "phaser";

export default function Tile(scene, tileproperties) {
  this.scene = scene;
  this.rectangle = new Phaser.GameObjects.Rectangle(
    this.scene,
    tileproperties.x,
    tileproperties.y,
    tileproperties.width,
    tileproperties.height,
    0x80dfff
  );
  this.layer = new Phaser.GameObjects.Layer(this.scene);
  this.tileproperties = tileproperties;
}

//   graphics.fillGradientStyle(0xffff00, 0xff0000, 0xffff00, 0xff0000, 1);


Tile.prototype.createTile = function () {
  this.rectangle.setStrokeStyle(1);
  let entryGradient = new Phaser.GameObjects.Graphics(this.scene);
  if (this.tileproperties.type === "path") {
    this.rectangle.setFillStyle(0x000000);
  } else if (this.tileproperties.type === "start_path_top") {
    this.rectangle.fillColor = 0x000000;
    entryGradient.fillGradientStyle(0x7cfc00, 0xadff2f, 0x000000, 0x000000, 1);
    entryGradient.fillRect(
      this.tileproperties.x - 12,
      this.tileproperties.y - 10,
      this.tileproperties.width,
      this.tileproperties.height
    );
    this.scene.add.existing(entryGradient);
  } else if (this.tileproperties.type === "end_path_right") {
    this.rectangle.fillColor = 0x000000;
    entryGradient.fillGradientStyle(0x000000, 0xff0000, 0x000000, 0xff0000, 1);
    entryGradient.fillRect(
      this.tileproperties.x - 12,
      this.tileproperties.y - 10,
      this.tileproperties.width,
      this.tileproperties.height
    );
    this.scene.add.existing(entryGradient);
  } else if (this.tileproperties.type === "basic_gun") {
    this.rectangle.fillColor = 0x328720;
  } else {
    this.scene.add.existing(this.rectangle);
  }
};

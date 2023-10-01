import Phaser from "phaser";

const TILE_COLOR = 0x80dfff;
const PATH_COLOR = 0x000000;
const START_PATH_TOP_GRADIENT_COLORS = [0x7cfc00, 0xadff2f, 0x000000, 0x000000];
const END_PATH_RIGHT_GRADIENT_COLORS = [0x000000, 0xff0000, 0x000000, 0xff0000];
//TO-DO below has to be shifted from here to weapon
const BASIC_GUN_COLOR = 0x328720;
const HOMING_MISSILE_COLOR = 0xff8c00;

export default class Tile {
  constructor(scene, tileproperties) {
    this.scene = scene;
    this.rectangle = new Phaser.GameObjects.Rectangle(
      this.scene,
      tileproperties.x,
      tileproperties.y,
      tileproperties.width,
      tileproperties.height,
      TILE_COLOR
    );
    this.layer = new Phaser.GameObjects.Layer(this.scene);
    this.tileproperties = tileproperties;
  }

  createTile() {
    this.rectangle.setStrokeStyle(1);
    let entryGradient = new Phaser.GameObjects.Graphics(this.scene);
    if (this.tileproperties.type === "path") {
      this.rectangle.setFillStyle(PATH_COLOR);
    } else if (this.tileproperties.type === "start_path_top") {
      this.rectangle.fillColor = PATH_COLOR;
      entryGradient.fillGradientStyle(...START_PATH_TOP_GRADIENT_COLORS, 1);
      entryGradient.fillRect(
        this.tileproperties.x - 12,
        this.tileproperties.y - 10,
        this.tileproperties.width,
        this.tileproperties.height
      );
      this.scene.add.existing(entryGradient);
    } else if (this.tileproperties.type === "end_path_right") {
      this.rectangle.fillColor = PATH_COLOR;
      entryGradient.fillGradientStyle(...END_PATH_RIGHT_GRADIENT_COLORS, 1);
      entryGradient.fillRect(
        this.tileproperties.x - 12,
        this.tileproperties.y - 10,
        this.tileproperties.width,
        this.tileproperties.height
      );
      this.scene.add.existing(entryGradient);
    } else if (this.tileproperties.type === "basic_gun") {
      this.rectangle.fillColor = BASIC_GUN_COLOR;
    } else if (this.tileproperties.type === "homing_missile") {
      this.rectangle.fillColor = HOMING_MISSILE_COLOR;
    } else {
      this.scene.add.existing(this.rectangle);
    }
  }
}

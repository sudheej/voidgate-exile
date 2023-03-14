import Phaser from "phaser";
import Tile from "./components/Tile";
import Map from "./components/Map";
import Path from "./components/Path"
import Weapon from "./components/Weapon";
import plainmap from "./assets/maps/plainfield.json";
import { weaponarray } from "./state/WeaponArray";
import Inventory from "./components/Inventory";
import mySoundFileMp3 from "./assets/audio/background-music.mp3";
import mySoundFileogg from "./assets/audio/oggsound.ogg";

class Main extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.audio("theme", [mySoundFileMp3, mySoundFileogg]);
  }

  create() {


    var music = this.sound.add("theme");

    music.play();
    console.log(music);

    this.input.setDefaultCursor("url(assets/cursors/cur.cur), cursor");
    const map = new Map(this);
    map.MappingData = plainmap;
    map.createMap(100, 100);
    const inventory = new Inventory(this);
    inventory.createInvetory();

    const path = new Path();
    path.createPath(map.MappingData);
    console.log(path.PathData)

  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  parent: "game",
  width: 1000,
  height: 800,
  mode: Phaser.Scale.FIT,

  autoCenter: Phaser.Scale.CENTER_BOTH,
  scene: Main,
};

const game = new Phaser.Game(config);

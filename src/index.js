import Phaser from "phaser";
import Tile from "./components/Tile";
import Map from "./components/Map";
import Path from "./components/Path";
import Weapon from "./components/Weapon";
import Enemy from "./components/Enemy";
import plainmap from "./assets/maps/plainfield.json";
import plainmap_path from "./assets/maps/path/_path_plainfield.json";
import { weaponarray } from "./state/WeaponArray";
import Inventory from "./components/Inventory";
import enemy_list from "./assets/entities/enemys.json";
import weaponPickup from "./assets/audio/weapon_pickup.ogg";
import weaponPlace from "./assets/audio/weapon_place.ogg";
import Audio from "./utilities/Audio";
import blue from "./assets/effects/blue.png";
import { ScoreBoard } from "./components/ScoreBoard";

const AUDIOS = [
  { name: "_aud_weapon_pickup", src: weaponPickup },
  { name: "_aud_weapon_place", src: weaponPlace },
];

const MAP_WIDTH = 100;
const MAP_HEIGHT = 100;

class Main extends Phaser.Scene {
  constructor() {
    super();
    this.audio = new Audio(this);
  }

  preload() {
    this.audio.preload(AUDIOS);
    this.load.image("spark", blue);
  }

  create() {
    this.text = this.add.text(10, 10, "", {
      font: "16px Arial",
      fill: "#ffffff",
    });

    this.audio.create(AUDIOS);

    const scoreBoard = new ScoreBoard(this);

    const map = new Map(this);
    map.MappingData = plainmap;
    map.createMap(MAP_WIDTH, MAP_HEIGHT);

    const inventory = new Inventory(this);
    inventory.createInventory();

    const path = new Path(this);
    path.PathData = plainmap_path;

    const enemyPath = path.PathData[0];

    console.log(enemy_list);
    enemy_list.map((enemyObj) => {
      const enemy = new Enemy(this);
      enemy.createEnemyWithPath(enemyPath, enemyObj);
    });
  }

  update(time, delta) {
    const fps = Math.round(1000 / delta);
    const memory = Math.round(
      window.performance.memory.usedJSHeapSize / 1024 / 1024
    );

    this.text.setText(`FPS: ${fps} Memory: ${memory} MB`);
  }
}

const config = {
  type: Phaser.WEBGL,
  backgroundColor: "#000000",
  parent: "game",
  width: 1000,
  height: 800,
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  scene: Main,
};

const game = new Phaser.Game(config);

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
import weaponPickup from "./assets/audio/weapon_pickup.ogg";
import weaponPlace from "./assets/audio/weapon_place.ogg";
import Audio from "./utilities/Audio";

class Main extends Phaser.Scene {
  constructor() {
    super();
    this.audio = new Audio(this);
  }

  preload() {
    this.audio.preload([
      { name: "_aud_weapon_pickup", src: weaponPickup },
      { name: "_aud_weapon_place", src: weaponPlace },
    ]);
  }

  create() {
    this.text = this.add.text(10, 10, "", {
      font: "16px Arial",
      fill: "#ffffff",
    });

    this.audio.create([
      { name: "_aud_weapon_pickup" },
      { name: "_aud_weapon_place" },
    ]);

    // Register the update event to calculate the FPS
    // this.events.on('update', this.updateFps, this);

    //var music = this.sound.add("theme");

    //music.play();

    //this.input.setDefaultCursor("url(assets/cursors/cur.cur), cursor");
    const map = new Map(this);
    map.MappingData = plainmap;
    map.createMap(100, 100);
    const inventory = new Inventory(this);
    inventory.createInventory();

    const path = new Path(this);
    path.PathData = plainmap_path;


    var enemyPath = path.PathData[0];

    const enemy = new Enemy(this);

    // Create the enemy object as a shape
    var blue_bingili = this.add
      .rectangle(enemyPath[0].x, enemyPath[0].y, 10, 10, 0xd0d7ff)
      .setName("enemy");

    blue_bingili.setName("enemy");

    blue_bingili.name = "enemy";
    enemy.createEnemyWithPath(enemyPath, blue_bingili);
  }

  update(time, delta) {
    // calculate fps
    let fps = Math.round(1000 / delta);

    // calculate cpu and memory usage
    let memory = Math.round(
      window.performance.memory.usedJSHeapSize / 1024 / 1024
    );

    // update text object with current fps, cpu, and memory usage
    this.text.setText(`FPS: ${fps} Memory: ${memory} MB`);
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

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
import explosion from "./assets/audio/explosion.ogg";
import weaponPlace from "./assets/audio/weapon_place.ogg";
import Audio from "./utilities/Audio";
import blue from "./assets/effects/blue.png";
import flarePng from "./assets/effects/flares.png";
import flareJson from "./assets/effects/flares.json";
import { ScoreBoard } from "./components/ScoreBoard";
import Wave from "./components/Wave";
import { gameStore } from "./state/GameStore";
import GlowFilterPipelinePlugin from "phaser3-rex-plugins/plugins/glowfilterpipeline-plugin.js";
import WebFont from "webfontloader";

const AUDIOS = [
  { name: "_aud_weapon_pickup", src: weaponPickup },
  { name: "_aud_explosion", src: explosion },
  { name: "_aud_weapon_place", src: weaponPlace },
];

const MAP_WIDTH = 300;
const MAP_HEIGHT = 300;

class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );

    // Load your assets here
    WebFont.load({
      google: {
        families: ["Electrolize"],
      },
      active: function () {
        // Font is loaded and ready to use
        // Load your scene here
        this.scene.start("Main");
      }.bind(this),
    });
  }
}

class Main extends Phaser.Scene {
  constructor() {
    super("Main");
    this.audio = new Audio(this);
    this.wave = new Wave(this);
  }

  preload() {
    this.audio.preload(AUDIOS);
    this.load.image("spark", blue);
    this.load.atlas("flares", flarePng, flareJson);
  }

  create() {
    this.text = this.add.text(10, 760, "", {
      font: "15px Electrolize",
      fill: "#4DD4CA",
    });

    this.title = this.add.text(10,4,"Void Gate Exile", {
      font: "25px Electrolize",
      fill: "#4DD4CA",
    })

    const fx1 = this.title.postFX.addGlow(0x4DD4CA, 0, 0, false, 0.1, 24);

    this.tweens.add({
      targets: fx1,
      outerStrength: 1,
      yoyo: true,
      loop: -1,
      ease: 'sine.inout'
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

    this.enemyPath = path.PathData[0];

    //this.wave = new Wave(this);
    this.wave.createWave(this.enemyPath);
  }

  update(time, delta) {
    const fps = Math.round(1000 / delta);
    const memory = Math.round(
      window.performance.memory.usedJSHeapSize / 1024 / 1024
    );
    this.wave.updateEnemyStatus();
    if (this.wave.wavestart && this.wave.currentEnemies.length === 0) {
      gameStore.wave += 1;
      this.wave.wavestart = false;
      this.wave.createWave(this.enemyPath);
    }
    gameStore.enemies = this.wave.currentEnemies.length
    this.text.setText(
      `FPS: ${fps} Memory: ${memory} MB`
    );
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
  scene: [PreloadScene, Main],
  plugins: {
    global: [
      {
        key: "rexGlowFilterPipeline",
        plugin: GlowFilterPipelinePlugin,
        start: true,
      },
    ],
  },
};

const game = new Phaser.Game(config);

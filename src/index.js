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
import Wave from "./components/Wave";
import { gameStore } from "./state/GameStore";

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
    this.wave = new Wave(this);
  }

  preload() {
    this.audio.preload(AUDIOS);
    this.load.image("spark", blue);
    this.load.glsl('glowShader',"./assets/shaders/glow.glsl");
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

    this.enemyPath = path.PathData[0];

    console.log(enemy_list);
    //this.wave = new Wave(this);
    this.wave.createWave(this.enemyPath);

    let r2 = this.add.line(900, 100, 0, 0, 140, 0, 0x9966ff);

    // add shader effect
   let shader = new Phaser.Display.BaseShader('glow', `
  precision mediump float;
  
  uniform vec2      resolution;
  uniform float     time;
  uniform sampler2D uMainSampler;
  
  varying vec2 outTexCoord;
  
  void main(void)
  {
      vec2 uv = outTexCoord.xy;
      vec4 texColor = texture2D(uMainSampler, uv);
  
      float strength = 1;
      float glowRadius = 1;
  
      vec4 sum = vec4(0);
      vec2 texcoord = vec2(1.0 / resolution.x, 1.0 / resolution.y);
      for(int xx = -4; xx <= 4; xx += 2)
      {
          for(int yy = -4; yy <= 4; yy += 2)
          {
              vec2 offset = vec2(float(xx), float(yy)) * glowRadius;
              sum += texture2D(uMainSampler, uv + texcoord * offset) * strength;
          }
      }
  
      gl_FragColor = sum * texColor;
  }
  `);
  
  r2.setLineWidth(10,10)

  let pipeline = this.sys.renderer.pipelines.add('Glow', shader);
  r2.setPipeline(pipeline); 
  
    //laser.postFx.addBloom()


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
    this.text.setText(
      `FPS: ${fps} Memory: ${memory} MB Enemies: ${this.wave.currentEnemies.length}`
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
  scene: Main,
};

const game = new Phaser.Game(config);

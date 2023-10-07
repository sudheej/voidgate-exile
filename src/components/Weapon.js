import Tile from "./Tile";
import { weaponarray } from "../state/WeaponArray";
import fireLaser from "./WeaponFiringAction/FireLaser"
import fireHomingMissile from "./WeaponFiringAction/FireHomingMissile"

const ZONE_RADIUS = 60;
const HOMING_TURN_DEGREES_PER_FRAME = 2.25;
const HOMING_MISSILE_SPEED = 3;

function Weapon(scene, weaponproperties) {
  Tile.call(this, scene, weaponproperties);
}

Weapon.prototype = Object.create(Tile.prototype);

function checkEnemyInZone(weaponShape, enemyShape, t) {
  const currentShape = new Phaser.Geom.Rectangle(
    weaponShape.x,
    weaponShape.y,
    weaponShape.width,
    weaponShape.height
  );
  const givenShape = new Phaser.Geom.Rectangle(
    enemyShape.x,
    enemyShape.y,
    enemyShape.width,
    enemyShape.height
  );
  const zone = new Phaser.Geom.Circle(
    currentShape.x,
    currentShape.y,
    ZONE_RADIUS
  );

  const distance = Phaser.Math.Distance.Between(
    givenShape.centerX,
    givenShape.centerY,
    zone.x,
    zone.y
  );

  if (distance < ZONE_RADIUS) {
    if (enemyShape.active) {
      fireWeapon(weaponShape, enemyShape, t);
    }
  }
}

function fireWeapon(weaponShape, enemyShape, t) {
  if (t.tileproperties.type === "basic_gun") {
    fireLaser(weaponShape, enemyShape, t.scene)
  } else if (t.tileproperties.type === "homing_missile") {
    fireHomingMissile(weaponShape, enemyShape, t.scene);
  }
}




function createWeaponGraphics(t) {
  if (t.tileproperties.type === "basic_gun") {
    return t.scene.add.line(
      t.tileproperties.x,
      t.tileproperties.y,
      0,
      0,
      20,
      0,
      0xffffff
    );
  } else if (t.tileproperties.type === "homing_missile") {
    return t.scene.add.rectangle(
      t.tileproperties.x,
      t.tileproperties.y,
      10,
      10,
      0x000000
    );
  }
}

Weapon.prototype.createTile = function () {
  this.rectangle.setInteractive();

  const graphics = this.scene.add.graphics();
  graphics.lineStyle(2, 0x00ff00);

  this.rectangle.on("pointerdown", (pointer) => {
    if (this.rectangle.name === "weapontimele") {
      return;
    }

    graphics.clear();
    graphics.strokeCircle(this.rectangle.x, this.rectangle.y, ZONE_RADIUS);
    this.scene.add.existing(graphics);
  });

  this.rectangle.on("pointerout", () => {
    graphics.clear();
    this.scene.children.remove(graphics);
  });

  this.rectangle.name = this.tileproperties._id;
  const weaponHull = this.scene.add.existing(this.rectangle);
  const weaponPrimary = createWeaponGraphics(this);

  let tweenProgress = 0;
  this.scene.time.addEvent({
    delay: 100,
    loop: true,
    callback: function () {
      tweenProgress += 0.5;
      if (tweenProgress > 1) {
        tweenProgress -= 1;
      }

      const objects = this.scene.children.getAll();
      const enemyObjects = objects.filter((obj) => obj.name === "enemy");
      enemyObjects.forEach((enemy) => {
        checkEnemyInZone(weaponHull, enemy, this);
      });
    }.bind(this),
  });

  this.layer.add(weaponHull, weaponPrimary);

  Tile.prototype.createTile.call(this);
};

export default Weapon;

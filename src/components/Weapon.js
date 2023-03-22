import Tile from "./Tile";
import { weaponarray } from "../state/WeaponArray";

const ZONE_RADIUS = 60;

function Weapon(scene, weaponproperties) {
  Tile.call(this, scene, weaponproperties);
}

Weapon.prototype = Object.create(Tile.prototype);

function checkEnemyInZone(weaponShape, enemyShape, scene) {
  const currentShape = new Phaser.Geom.Rectangle(weaponShape.x, weaponShape.y, weaponShape.width, weaponShape.height);
  const givenShape = new Phaser.Geom.Rectangle(enemyShape.x, enemyShape.y, enemyShape.width, enemyShape.height);
  const zone = new Phaser.Geom.Circle(currentShape.x, currentShape.y, ZONE_RADIUS);

  const distance = Phaser.Math.Distance.Between(givenShape.centerX, givenShape.centerY, zone.x, zone.y);

  if (distance < ZONE_RADIUS) {
    fireLaser(weaponShape, enemyShape, scene);
  }
}

function fireLaser(weapon, enemy, scene) {
  const distancefromenemy = Phaser.Math.Distance.Between(weapon.x, weapon.y, enemy.x, enemy.y);
  const laser = scene.add.line(weapon.x, weapon.y, distancefromenemy, 0, 0, 0);
  laser.lineWidth = 0.02;
  laser.setOrigin(0, 0);
  laser.setStrokeStyle(1, 0x05f9fb);
  const tween = scene.tweens.add({
    targets: laser,
    alpha: 0,
    ease: "Cubic.easeOut",
    duration: 40,
    repeat: 0,
    yoyo: true,
  });

  laser.rotation = Phaser.Math.Angle.Between(weapon.x, weapon.y, enemy.x + scene.cameras.main.scrollX, enemy.y + scene.cameras.main.scrollY);
  laser.setTo(0, 0, distancefromenemy, 0);

  scene.time.delayedCall(20, () => laser.destroy());
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
  const weaponPrimary = this.scene.add.line(this.tileproperties.x, this.tileproperties.y, 0, 0, 20, 0, 0xffffff);

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
        checkEnemyInZone(weaponHull, enemy, this.scene);
      });
    }.bind(this),
  });

  this.layer.add(weaponHull, weaponPrimary);

  Tile.prototype.createTile.call(this);
};

export default Weapon;

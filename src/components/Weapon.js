import Tile from "./Tile";
import { weaponarray } from "../state/WeaponArray";

export default function Weapon(scene, weaponproperties) {
  Tile.call(this, scene, weaponproperties);
}

Weapon.prototype = Object.create(Tile.prototype);

let TARGET_ON_SIGHT=false

function checkEnemyInZone(weaponShape, enemyShape, scene) {
  // if (weaponShape.name === "weapontimele")
  // return;

  // create current shape object
  let currentShape = new Phaser.Geom.Rectangle(
    weaponShape.x,
    weaponShape.y,
    weaponShape.width,
    weaponShape.height
  );

  // create given shape object
  let givenShape = new Phaser.Geom.Rectangle(
    enemyShape.x,
    enemyShape.y,
    enemyShape.width,
    enemyShape.height
  );

  // create a circular zone around the current shape object
  let zoneRadius = 60;
  let zone = new Phaser.Geom.Circle(
    currentShape.x,
    currentShape.y,
    zoneRadius
  );

  let graphics = scene.add.graphics();
  graphics.lineStyle(2, 0x00ff00);
  graphics.strokeCircle(zone.x, zone.y, zoneRadius);

  // check if the given shape object intersects or overlaps with the zone
  let distance = Phaser.Math.Distance.Between(
    givenShape.centerX,
    givenShape.centerY,
    zone.x,
    zone.y
  );

  if (distance < zoneRadius) {
    console.log("Got close to the enemy");
    fireLaser(weaponShape, enemyShape, scene);
  }
}

function fireLaser(weapon, enemy, scene) {
  let distancefromenemy = Phaser.Math.Distance.Between(
    weapon.x,
    weapon.y,
    enemy.x,
    enemy.y
  );
  let laser = scene.add.line(weapon.x, weapon.y, distancefromenemy, 0, 0, 0);
  laser.lineWidth = 0.02;
  laser.setOrigin(0, 0);
  laser.setStrokeStyle(1, 0x05f9fb);
  let tween = scene.tweens.add({
    targets: laser,
    alpha: 0,
    ease: "Cubic.easeOut",
    duration: 40,
    repeat: 0,
    yoyo: true,
  });

  laser.rotation = Phaser.Math.Angle.Between(
    weapon.x,
    weapon.y,
    enemy.x + scene.cameras.main.scrollX,
    enemy.y + scene.cameras.main.scrollY
  );
  laser.setTo(0, 0, distancefromenemy, 0);
  
  console.log(distancefromenemy);

  scene.time.delayedCall(20, () => {
    laser.destroy();
  });

}

Weapon.prototype.createTile = function () {
  this.rectangle.setInteractive();
  this.rectangle.name = this.tileproperties._id;
  let weaponHull = this.scene.add.existing(this.rectangle);
  let weaponPrimary = this.scene.add.line(
    this.tileproperties.x,
    this.tileproperties.y,
    0,
    0,
    20,
    0,
    0xffffff
  );
  var tweenProgress = 0;
  // iterate over the objects and log their names

  this.scene.time.addEvent({
    delay: 500,
    loop: true,
    callback: function () {
      tweenProgress += 0.003; // Increment the progress by the time elapsed since last update (16ms)
      if (tweenProgress > 1) {
        tweenProgress -= 1; // Loop back to the beginning of the path
      }

      // iterate over the array and log the type and name of each child
      let objects = this.scene.children.getAll();
      const enemyObjects = objects.filter((obj) => obj.name === "enemy");
      //console.log("Enemies found:", enemyObjects.length);
      enemyObjects.map((enemy) => {
        checkEnemyInZone(weaponHull, enemy, this.scene);
      });
    }.bind(this), // Bind the "this" value of the Weapon object to the callback function
  });

  this.layer.add(weaponHull, weaponPrimary);

  
  Tile.prototype.createTile.call(this);
};

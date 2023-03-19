import Tile from "./Tile";
import { weaponarray } from "../state/WeaponArray";

export default function Weapon(scene, weaponproperties) {
  Tile.call(this, scene, weaponproperties);
}

Weapon.prototype = Object.create(Tile.prototype);

Weapon.prototype.createTile = function () {
  this.rectangle.setInteractive();
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

  this.scene.tweens.add({
    targets: weaponPrimary,
    angle: 90,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });


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
      console.log("Enemies found:", enemyObjects.length);

    }.bind(this), // Bind the "this" value of the Weapon object to the callback function
  });

  this.layer.add(weaponHull, weaponPrimary);

  this.rectangle.name = this.tileproperties._id;
  Tile.prototype.createTile.call(this);
};

import Tile from "./Tile";
import { weaponarray } from "../state/WeaponArray";
import fireLaser from "./WeaponFiringAction/FireLaser"
import fireHomingMissile from "./WeaponFiringAction/FireHomingMissile"
import fireStunGun from "./WeaponFiringAction/FireStunGun";

const ZONE_RADIUS = 60;


function Weapon(scene, weaponproperties) {
  Tile.call(this, scene, weaponproperties);
}

Weapon.prototype = Object.create(Tile.prototype);
function checkEnemyInZone(weaponShape, enemyObjects, t) {
  const currentShape = new Phaser.Geom.Rectangle(
    weaponShape.x,
    weaponShape.y,
    weaponShape.width,
    weaponShape.height
  );
  const zone = new Phaser.Geom.Circle(
    currentShape.x,
    currentShape.y,
    ZONE_RADIUS
  );

  // Calculate distances between weapon and each enemy object in zone
  const distances = enemyObjects.map((enemy) => {
    const givenShape = new Phaser.Geom.Rectangle(
      enemy.x,
      enemy.y,
      enemy.width,
      enemy.height
    );
    const distance = Phaser.Math.Distance.Between(
      givenShape.centerX,
      givenShape.centerY,
      zone.x,
      zone.y
    );
    return { enemy, distance };
  });

  // Choose an enemy based on the specified strategy
  const strategy = "nearest"
  const selectedEnemy = chooseEnemy(enemyObjects, distances, strategy);

  if (selectedEnemy && selectedEnemy.active) {
    fireWeapon(weaponShape, selectedEnemy, t);
  }
}

function chooseEnemy(enemyObjects, distances, strategy) {
  let selectedEnemy;
  if (strategy === "nearest") {
    selectedEnemy = distances
      .filter(({ distance }) => distance < ZONE_RADIUS)
      .sort((a, b) => a.distance - b.distance)
      .map(({ enemy }) => enemy)
      .shift();
  } else if (strategy === "lowestHealth") {
    selectedEnemy = enemyObjects
      .filter((enemy) => {
        const distance = distances.find(
          ({ enemy: e }) => e === enemy
        ).distance;
        return enemy.active && enemy.health >= 0 && distance < ZONE_RADIUS;
      })
      .sort((a, b) => a.health - b.health)
      .shift();
  }

  return selectedEnemy;
}


function fireWeapon(weaponShape, enemyShape, t) {
  weaponShape.setData("damage", t.tileproperties.damage);
  if (t.tileproperties.type === "basic_gun") {
    fireLaser(weaponShape, enemyShape, t.scene)
  } else if (t.tileproperties.type === "homing_missile") {
    fireHomingMissile(weaponShape, enemyShape, t.scene);
  } else if (t.tileproperties.type === "stun_gun") {
    fireStunGun(weaponShape, enemyShape, t.scene);
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
  else if (t.tileproperties.type === "stun_gun") {
    return t.scene.add.star(
      t.tileproperties.x,
      t.tileproperties.y,
      8,
      4,
      9,
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


  this.scene.time.addEvent({
    delay: 100,
    loop: true,
    callback: function () {
      const objects = this.scene.children.getAll();
      const enemyObjects = objects.filter((obj) => obj.name === "enemy");

       checkEnemyInZone(weaponHull,enemyObjects,this)

    }.bind(this),
  });

  this.layer.add(weaponHull, weaponPrimary);

  Tile.prototype.createTile.call(this);
};

export default Weapon;

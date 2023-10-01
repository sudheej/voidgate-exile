import Tile from "./Tile";
import { weaponarray } from "../state/WeaponArray";

const ZONE_RADIUS = 60;
const HOMING_TURN_DEGREES_PER_FRAME = 2.25
const HOMING_MISSILE_SPEED = 5

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
    fireWeapon(weaponShape, enemyShape, t);
  }
}

function fireWeapon(weaponShape,enemyShape,t) {
  if (t.tileproperties.type === "basic_gun") {
    fireLaser(weaponShape, enemyShape, t.scene);
  } else if (t.tileproperties.type === "homing_missile") {
    fireHomingMissile(weaponShape,enemyShape,t.scene);
  }

}

function fireHomingMissile(weapon, enemy, scene) {
  if (enemy.getData('locked') === "true" ) {
    return;
  }

 

    let rocket = scene.add.rectangle(weapon.x, weapon.y,8,8, 0xff8c00)
    rocket.setData('alive','true')
  
 

  enemy.setData('locked','true')

  scene.time.addEvent({
    delay: 10,
    loop: true,
    callback: function () {
      const targetAngle = Phaser.Math.Angle.Between(rocket.x, rocket.y, enemy.x, enemy.y)
      let diff = Phaser.Math.Angle.Wrap(targetAngle - rocket.rotation)
     
      if (Math.abs(diff) < Phaser.Math.DegToRad(HOMING_TURN_DEGREES_PER_FRAME))
      {
        rocket.rotation = targetAngle;
      }
      else
      {
        let angle = rocket.angle
        if (diff > 0)
        {
          // turn clockwise
          angle += HOMING_TURN_DEGREES_PER_FRAME
        }
        else
        {
          // turn counter-clockwise
          angle -= HOMING_TURN_DEGREES_PER_FRAME
        }
        
        rocket.setAngle(angle)
      }
        // move missile in direction facing
      const vx = Math.cos(rocket.rotation) * HOMING_MISSILE_SPEED
      const vy = Math.sin(rocket.rotation) * HOMING_MISSILE_SPEED
    
      
        rocket.setX(rocket.x + vx)
        rocket.setY(rocket.y + vy)
    
    
        if(Math.abs(rocket.x - enemy.x) < 2 && Math.abs(rocket.y - enemy.y) < 2){
            console.log("I am hit")
            console.log(enemy.health)
            if (enemy.health > 0) {
              enemy.decreaseHealth(10);
            } else {
              enemy.destroyEnemy();
              enemy.destroy();
            }
           rocket.destroy();
            
    
        }

    }.bind(this),
  });
}

function fireLaser(weapon, enemy, scene) {
  const distancefromenemy = Phaser.Math.Distance.Between(
    weapon.x,
    weapon.y,
    enemy.x,
    enemy.y
  );
  const laser = scene.add.line(weapon.x, weapon.y, distancefromenemy, 0, 0, 0);
  if (Math.random() < 0.2) {
    if (!scene.glowFilter) {
      scene.glowFilter = scene.plugins.get("rexGlowFilterPipeline").add(laser, {
        intensity: 0.05,
        color: 0xffffff,
        quality: 100,
      });
    } else {
      scene.plugins.get("rexGlowFilterPipeline").add(laser, {
        intensity: 0.05,
        color: 0xffffff,
        quality: 100,
        pipeline: scene.glowFilter.pipeline,
      });
    }
  }

  laser.lineWidth = 0.02;
  laser.setOrigin(0, 0);
  laser.setStrokeStyle(1, 0x05f9fb);
  const tween = scene.tweens.add({
    targets: laser,
    alpha: 0,
    ease: "Cubic.easeOut",
    duration: 500,
    repeat: 0,
    yoyo: false,
    onComplete: function () {
      laser.destroy();
    },
  });

  laser.rotation = Phaser.Math.Angle.Between(
    weapon.x,
    weapon.y,
    enemy.x + scene.cameras.main.scrollX,
    enemy.y + scene.cameras.main.scrollY
  );
  laser.setTo(0, 0, distancefromenemy, 0);
  if (enemy.health > 0) {
    enemy.decreaseHealth(1);
  } else {
    enemy.destroyEnemy();
    enemy.destroy();
  }

  scene.time.delayedCall(20, () => laser.destroy());
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

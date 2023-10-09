const HOMING_TURN_DEGREES_PER_FRAME = 2.25;
const HOMING_MISSILE_SPEED = 3;

export default function fireHomingMissile(weapon, enemy, scene) {
  if (
    weapon.getData("fired") === "true" ||
    enemy.getData("lockedBy") === weapon
  ) {
    return;
  }

  const rocket = scene.add.rectangle(weapon.x, weapon.y, 6, 6, 0xff7700);

  scene.time.delayedCall(3000, () => {
    if (rocket) {
      rocket.destroy();
    }
  });

  weapon.setData("fired", "true");
  enemy.setData("lockedBy", weapon);

  const timer = scene.time.addEvent({
    delay: 13,
    loop: true,
    callback: function () {
      if (
        !rocket ||
        !enemy ||
        rocket.active === false ||
        enemy.active === false
      ) {
        handleMissileExplosion(rocket, enemy, weapon, timer);
        return;
      }

      handleMissileGuidance(rocket, enemy);
      handleMissileMovement(rocket);
      handleCollisionDetection(rocket, enemy, weapon, timer);
    }.bind(this),
  });

  function handleMissileExplosion(rocket, enemy, weapon, timer) {
    if (rocket) {
      rocket.destroy();
    }
    if (enemy) {
      enemy.setData("lockedBy", null);
    }
    weapon.setData("fired", "false");
    timer.remove();
  }

  function handleMissileGuidance(rocket, enemy) {
    const targetAngle = Phaser.Math.Angle.Between(
      rocket.x,
      rocket.y,
      enemy.x,
      enemy.y
    );
    let diff = Phaser.Math.Angle.Wrap(targetAngle - rocket.rotation);

    if (Math.abs(diff) < Phaser.Math.DegToRad(HOMING_TURN_DEGREES_PER_FRAME)) {
      rocket.rotation = targetAngle;
    } else {
      let angle = rocket.angle;
      angle +=
        diff > 0
          ? HOMING_TURN_DEGREES_PER_FRAME
          : -HOMING_TURN_DEGREES_PER_FRAME;
      rocket.setAngle(angle);
    }
  }

  function handleMissileMovement(rocket) {
    const vx = Math.cos(rocket.rotation) * HOMING_MISSILE_SPEED;
    const vy = Math.sin(rocket.rotation) * HOMING_MISSILE_SPEED;
    rocket.setX(rocket.x + vx);
    rocket.setY(rocket.y + vy);
  }

  function handleCollisionDetection(rocket, enemy, weapon, timer) {
    if (Math.abs(rocket.x - enemy.x) < 3 && Math.abs(rocket.y - enemy.y) < 3) {
      rocket.destroy();
      handleMissileExplosion(rocket, enemy, weapon, timer);
      if (enemy.health > 0) {
        enemy.decreaseHealth(10);
        enemy.setData("lockedBy", null);
      } else if (enemy !== null) {
        enemy.destroyEnemy();
        enemy.destroy();
      }
    }
  }
}

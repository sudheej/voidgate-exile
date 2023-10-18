export default function fireLaser(weapon, enemy, scene) {
  const distanceFromEnemy = Phaser.Math.Distance.Between(
    weapon.x,
    weapon.y,
    enemy.x,
    enemy.y
  );
  const laser = createLaser(weapon, distanceFromEnemy, scene);

  laser.rotation = Phaser.Math.Angle.Between(
    weapon.x,
    weapon.y,
    enemy.x + scene.cameras.main.scrollX,
    enemy.y + scene.cameras.main.scrollY
  );
  laser.setTo(0, 0, distanceFromEnemy, 0);

  handleLaserGlow(scene, laser);

  if (enemy.health > 0) {
    enemy.decreaseHealth(weapon.getData("damage"));
  } else {
    enemy.destroyEnemy();
    enemy.destroy();
  }

  scene.time.delayedCall(20, () => laser.destroy());
}

function createLaser(weapon, distance, scene) {
  const LASER_COLOR = 0x32cd32;

  const laser = scene.add.line(weapon.x, weapon.y, distance, 0, 0, 0);
  laser.lineWidth = 0.02;
  laser.setOrigin(0, 0);
  laser.setStrokeStyle(1, LASER_COLOR);

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

  return laser;
}

function handleLaserGlow(scene, laser) {
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
}

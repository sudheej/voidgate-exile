export default function fireStunGun(weapon, enemy, scene) {
  if(Math.random() < 0.9)
  return;

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
    enemy.stun(500);
  } else {
    enemy.destroyEnemy();
    enemy.destroy();
  }

  scene.time.delayedCall(20, () => laser.destroy());
}

function createLaser(weapon, distance, scene) {
  const laser = scene.add.line(weapon.x, weapon.y, distance, 0, 0, 0);
  laser.lineWidth = 0.2;
  laser.setOrigin(0, 0);
  laser.setStrokeStyle(1, 0x05f9fb);

  const tween = scene.tweens.add({
    targets: laser,
    alpha: 0,
    ease: "Back.easeOut",
    duration: 3000,
    repeat: 0,
    yoyo: true,
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
        intensity: 0.2,
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

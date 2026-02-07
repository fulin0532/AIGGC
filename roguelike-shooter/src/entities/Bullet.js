import Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'bullet');

    this.lifespan = 0;
    this.speed = 0;
    this.damage = 0;
  }

  fire(angle, weapon, playerAttack) {
    this.setActive(true);
    this.setVisible(true);

    this.speed = weapon.projectileSpeed;
    this.damage = weapon.damage + playerAttack;
    this.lifespan = weapon.range / weapon.projectileSpeed * 1000;

    this.setRotation(angle);

    this.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );

    // 设置生命周期
    this.scene.time.delayedCall(this.lifespan, () => {
      this.destroy();
    });
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }
}

export class BulletGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      classType: Bullet,
      frameQuantity: 50,
      active: false,
      visible: false,
      key: 'bullet',
    });
  }

  fireBullet(x, y, angle, weapon, playerAttack) {
    const bullet = this.getFirstDead(false);

    if (bullet) {
      bullet.fire(angle, weapon, playerAttack);
    }
  }
}

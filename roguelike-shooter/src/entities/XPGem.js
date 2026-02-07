import Phaser from 'phaser';

export default class XPGem extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, value) {
    super(scene, x, y, 'xp');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.xpValue = value;
    this.collected = false;

    // 添加磁吸效果的检测范围
    this.attractRadius = 150;

    // 添加闪烁效果
    scene.tweens.add({
      targets: this,
      scale: { from: 0.8, to: 1.2 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  update(player) {
    if (this.collected) return;

    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      player.x, player.y
    );

    // 磁吸效果
    if (distance < this.attractRadius) {
      const angle = Phaser.Math.Angle.Between(
        this.x, this.y,
        player.x, player.y
      );

      const speed = 300;
      this.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );
    } else {
      this.setVelocity(0, 0);
    }
  }

  collect(player) {
    if (this.collected) return;

    this.collected = true;
    player.gainXP(this.xpValue);

    // 收集动画
    this.scene.tweens.add({
      targets: this,
      scale: 0,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.destroy();
      }
    });
  }
}

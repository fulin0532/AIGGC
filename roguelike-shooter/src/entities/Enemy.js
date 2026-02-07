import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    const config = type === 'boss' ? GameConfig.boss : GameConfig.enemies[type];
    const texture = type === 'boss' ? 'boss' : type;

    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
    this.type = type;
    this.config = config;

    // 敌人属性
    this.maxHealth = config.health;
    this.health = this.maxHealth;
    this.speed = config.speed;
    this.damage = config.damage;
    this.score = config.score;
    this.xpValue = config.xp;

    // 攻击冷却
    this.lastAttackTime = 0;
    this.attackCooldown = 1000;

    this.setCollideWorldBounds(true);

    // 创建血条
    this.createHealthBar();
  }

  createHealthBar() {
    const barWidth = this.width;
    const barHeight = 4;
    const barY = -this.height / 2 - 8;

    this.healthBarBg = this.scene.add.graphics();
    this.healthBarBg.fillStyle(0x000000, 0.5);
    this.healthBarBg.fillRect(
      this.x - barWidth / 2,
      this.y + barY,
      barWidth,
      barHeight
    );

    this.healthBar = this.scene.add.graphics();

    // 创建血量数字文本
    this.healthText = this.scene.add.text(this.x, this.y + barY - 8, '', {
      font: '12px monospace',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    this.updateHealthBar();
  }

  updateHealthBar() {
    if (!this.healthBar) return;

    const barWidth = this.width;
    const barHeight = 4;
    const barY = -this.height / 2 - 8;

    const healthPercent = this.health / this.maxHealth;
    const color = healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.25 ? 0xffff00 : 0xff0000;

    this.healthBar.clear();
    this.healthBar.fillStyle(color, 1);
    this.healthBar.fillRect(
      this.x - barWidth / 2,
      this.y + barY,
      barWidth * healthPercent,
      barHeight
    );

    // 更新背景位置
    if (this.healthBarBg) {
      this.healthBarBg.clear();
      this.healthBarBg.fillStyle(0x000000, 0.5);
      this.healthBarBg.fillRect(
        this.x - barWidth / 2,
        this.y + barY,
        barWidth,
        barHeight
      );
    }

    // 更新血量数字
    if (this.healthText) {
      this.healthText.setPosition(this.x, this.y + barY - 8);
      this.healthText.setText(`${Math.ceil(this.health)}/${this.maxHealth}`);
    }
  }

  update(time, player) {
    if (!this.active || !player.active) return;

    // 追踪玩家
    this.moveTowardsPlayer(player);

    // 更新血条位置
    this.updateHealthBar();

    // 检测攻击
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      player.x, player.y
    );

    if (distance < 40 && time - this.lastAttackTime > this.attackCooldown) {
      this.attack(player);
      this.lastAttackTime = time;
    }
  }

  moveTowardsPlayer(player) {
    const angle = Phaser.Math.Angle.Between(
      this.x, this.y,
      player.x, player.y
    );

    this.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );
  }

  attack(player) {
    player.takeDamage(this.damage);
  }

  takeDamage(amount) {
    this.health -= amount;
    this.updateHealthBar();

    // 受伤闪烁
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    // 掉落经验
    this.scene.spawnXP(this.x, this.y, this.xpValue);

    // 增加分数
    this.scene.addScore(this.score);

    // 清理血条和血量文本
    if (this.healthBar) {
      this.healthBar.destroy();
      this.healthBar = null;
    }
    if (this.healthBarBg) {
      this.healthBarBg.destroy();
      this.healthBarBg = null;
    }
    if (this.healthText) {
      this.healthText.destroy();
      this.healthText = null;
    }

    // 播放死亡效果（闪烁）
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.destroy();
      }
    });
  }

  destroy() {
    if (this.healthBar) {
      this.healthBar.destroy();
    }
    if (this.healthBarBg) {
      this.healthBarBg.destroy();
    }
    if (this.healthText) {
      this.healthText.destroy();
    }
    super.destroy();
  }
}

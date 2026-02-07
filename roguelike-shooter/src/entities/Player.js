import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;

    // 玩家属性
    this.maxHealth = GameConfig.player.maxHealth;
    this.health = this.maxHealth;
    this.speed = GameConfig.player.speed;
    this.attackPower = GameConfig.player.baseAttack;
    this.attackSpeed = GameConfig.player.attackSpeed;

    // 等级和经验
    this.level = 1;
    this.xp = 0;
    this.xpToNextLevel = GameConfig.levelUp.baseXP;

    // 武器
    this.weapons = ['pistol'];
    this.currentWeapon = 'pistol';
    this.lastFireTime = 0;

    // 统计
    this.kills = 0;

    // 设置碰撞体
    this.setCollideWorldBounds(true);
    this.setScale(1);

    // 输入控制
    this.cursors = scene.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  update(time, enemies) {
    this.handleMovement();
    this.autoShoot(time, enemies);
  }

  handleMovement() {
    const velocity = new Phaser.Math.Vector2(0, 0);

    if (this.cursors.w.isDown) {
      velocity.y = -1;
    } else if (this.cursors.s.isDown) {
      velocity.y = 1;
    }

    if (this.cursors.a.isDown) {
      velocity.x = -1;
    } else if (this.cursors.d.isDown) {
      velocity.x = 1;
    }

    velocity.normalize();
    velocity.scale(this.speed);

    this.setVelocity(velocity.x, velocity.y);
  }

  autoShoot(time, enemies) {
    const weapon = GameConfig.weapons[this.currentWeapon];
    const fireRate = weapon.fireRate / this.attackSpeed;

    if (time - this.lastFireTime < fireRate) {
      return;
    }

    // 找到最近的敌人
    const nearestEnemy = this.findNearestEnemy(enemies);
    if (!nearestEnemy) return;

    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      nearestEnemy.x, nearestEnemy.y
    );

    if (distance <= weapon.range) {
      this.shoot(nearestEnemy);
      this.lastFireTime = time;
    }
  }

  findNearestEnemy(enemies) {
    let nearest = null;
    let minDistance = Infinity;

    enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return;

      const distance = Phaser.Math.Distance.Between(
        this.x, this.y,
        enemy.x, enemy.y
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = enemy;
      }
    });

    return nearest;
  }

  shoot(target) {
    const weapon = GameConfig.weapons[this.currentWeapon];
    const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);

    if (weapon.pellets) {
      // 霰弹枪 - 发射多颗弹丸
      for (let i = 0; i < weapon.pellets; i++) {
        const spread = (Math.random() - 0.5) * 0.4; // 扩散角度
        this.createBullet(angle + spread, weapon);
      }
    } else {
      this.createBullet(angle, weapon);
    }
  }

  createBullet(angle, weapon) {
    const bullet = this.scene.bullets.get(this.x, this.y, 'bullet');
    if (bullet) {
      bullet.fire(angle, weapon, this.attackPower);
    }
  }

  takeDamage(amount) {
    this.health -= amount;

    // 受伤闪烁效果
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  heal(amount) {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  gainXP(amount) {
    this.xp += amount;

    if (this.xp >= this.xpToNextLevel) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.xp -= this.xpToNextLevel;
    this.xpToNextLevel = Math.floor(
      GameConfig.levelUp.baseXP * Math.pow(GameConfig.levelUp.xpMultiplier, this.level - 1)
    );

    // 触发升级选择界面
    this.scene.showLevelUpUI();
  }

  applyUpgrade(upgrade) {
    const effect = upgrade.effect;

    if (effect.maxHealth) {
      this.maxHealth += effect.maxHealth;
      this.health += effect.maxHealth;
    }

    if (effect.speed) {
      this.speed *= effect.speed;
    }

    if (effect.damage) {
      this.attackPower *= effect.damage;
    }

    if (effect.attackSpeed) {
      this.attackSpeed *= effect.attackSpeed;
    }

    if (effect.newWeapon) {
      // 解锁新武器
      const availableWeapons = Object.keys(GameConfig.weapons).filter(
        w => !this.weapons.includes(w)
      );
      if (availableWeapons.length > 0) {
        const newWeapon = Phaser.Utils.Array.GetRandom(availableWeapons);
        this.weapons.push(newWeapon);
      }
    }
  }

  die() {
    this.setActive(false);
    this.setVisible(false);
    this.scene.gameOver();
  }
}

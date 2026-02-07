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

    // 额外属性
    this.xpMultiplier = 1.0; // 经验获取倍率
    this.criticalChance = 0; // 暴击几率
    this.lifeSteal = 0; // 生命偷取
    this.weaponRange = 1.0; // 射程倍率
    this.projectileSpeed = 1.0; // 弹速倍率

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

    // 动画相关
    this.baseY = y; // 记录基础Y坐标
    this.bounceOffset = 0; // 跳动偏移
    this.bounceTime = 0; // 跳动时间计数器
    this.isMoving = false; // 是否在移动

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
    this.handleMovement(time);
    this.autoShoot(time, enemies);
    this.updateBounceAnimation(time);
  }

  handleMovement(time) {
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

    // 检测是否在移动
    this.isMoving = velocity.x !== 0 || velocity.y !== 0;
  }

  updateBounceAnimation(time) {
    if (this.isMoving) {
      // 移动时的跳动效果
      // 频率：每200ms完成一次跳动周期
      const bounceFrequency = 200; // 毫秒
      const bounceHeight = 3; // 跳动高度（像素）

      // 使用正弦波创建平滑的上下跳动
      this.bounceTime = time;
      const cycle = (time % bounceFrequency) / bounceFrequency;
      this.bounceOffset = Math.sin(cycle * Math.PI * 2) * bounceHeight;

      // 应用跳动偏移（只影响显示位置，不影响物理碰撞）
      this.setY(this.y - this.bounceOffset + (this.lastBounceOffset || 0));
      this.lastBounceOffset = this.bounceOffset;
    } else {
      // 静止时平滑回到正常位置
      if (Math.abs(this.bounceOffset) > 0.1) {
        this.bounceOffset *= 0.8; // 缓慢归零
        this.setY(this.y - this.bounceOffset + (this.lastBounceOffset || 0));
        this.lastBounceOffset = this.bounceOffset;
      } else {
        this.bounceOffset = 0;
        this.lastBounceOffset = 0;
      }
    }
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

    // 应用射程倍率
    if (distance <= weapon.range * this.weaponRange) {
      this.shoot(nearestEnemy, weapon);
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

  shoot(target, weapon) {
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
      // 应用暴击
      let finalDamage = this.attackPower;
      const isCritical = Math.random() < this.criticalChance;
      if (isCritical) {
        finalDamage *= 2;
        // 可以在这里添加暴击视觉效果
      }

      // 应用弹速和射程倍率
      const modifiedWeapon = {
        ...weapon,
        projectileSpeed: weapon.projectileSpeed * this.projectileSpeed,
        range: weapon.range * this.weaponRange,
      };

      bullet.fire(angle, modifiedWeapon, finalDamage, isCritical);
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
    this.xp += amount * this.xpMultiplier;

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

    if (effect.range) {
      this.weaponRange *= effect.range;
    }

    if (effect.projectileSpeed) {
      this.projectileSpeed *= effect.projectileSpeed;
    }

    if (effect.healNow) {
      this.heal(effect.healNow);
    }

    if (effect.xpMultiplier) {
      this.xpMultiplier *= effect.xpMultiplier;
    }

    if (effect.criticalChance) {
      this.criticalChance += effect.criticalChance;
    }

    if (effect.lifeSteal) {
      this.lifeSteal += effect.lifeSteal;
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

  onKillEnemy() {
    this.kills++;

    // 生命偷取
    if (this.lifeSteal > 0) {
      this.heal(this.lifeSteal);
    }
  }

  die() {
    this.setActive(false);
    this.setVisible(false);
    this.scene.gameOver();
  }
}

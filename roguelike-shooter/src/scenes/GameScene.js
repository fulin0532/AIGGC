import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemy from '../entities/Enemy';
import XPGem from '../entities/XPGem';
import { BulletGroup } from '../entities/Bullet';
import { GameConfig } from '../config/GameConfig';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // 初始化游戏状态
    this.score = 0;
    this.wave = 1;
    this.gameTime = 0;
    this.isPaused = false;
    this.currentWaveEnemyCount = 0; // 当前波次总敌人数
    this.currentWaveKilled = 0; // 当前波次已击杀

    // 创建世界边界
    this.physics.world.setBounds(0, 0, GameConfig.width, GameConfig.height);

    // 创建玩家
    this.player = new Player(this, GameConfig.width / 2, GameConfig.height / 2);

    // 创建子弹组
    this.bullets = new BulletGroup(this);

    // 创建敌人组
    this.enemies = this.physics.add.group();

    // 创建经验宝石组
    this.xpGems = this.physics.add.group();

    // 设置碰撞
    this.physics.add.overlap(this.bullets, this.enemies, this.bulletHitEnemy, null, this);
    this.physics.add.overlap(this.player, this.xpGems, this.collectXP, null, this);

    // 创建UI
    this.createUI();

    // 设置ESC暂停
    this.input.keyboard.on('keydown-ESC', () => {
      this.togglePause();
    });

    // 开始第一波
    this.startWave();

    // 游戏时间计时器
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!this.isPaused) {
          this.gameTime++;
          this.updateTimeText();
        }
      },
      loop: true
    });
  }

  update(time, delta) {
    if (this.isPaused) return;

    // 更新玩家
    if (this.player.active) {
      this.player.update(time, this.enemies);
    }

    // 更新敌人
    this.enemies.getChildren().forEach(enemy => {
      if (enemy.active) {
        enemy.update(time, this.player);
      }
    });

    // 更新经验宝石
    this.xpGems.getChildren().forEach(gem => {
      if (gem.active) {
        gem.update(this.player);
      }
    });

    // 更新UI
    this.updateUI();
  }

  createUI() {
    const padding = 20;

    // 血条背景
    this.healthBarBg = this.add.graphics();
    this.healthBarBg.fillStyle(0x000000, 0.5);
    this.healthBarBg.fillRect(padding, padding, 200, 20);

    // 血条
    this.healthBar = this.add.graphics();

    // 血量文本
    this.healthText = this.add.text(padding + 100, padding + 10, '', {
      font: '14px monospace',
      fill: '#ffffff',
    }).setOrigin(0.5);

    // 经验条背景
    this.xpBarBg = this.add.graphics();
    this.xpBarBg.fillStyle(0x000000, 0.5);
    this.xpBarBg.fillRect(padding, padding + 30, 200, 10);

    // 经验条
    this.xpBar = this.add.graphics();

    // 等级文本
    this.levelText = this.add.text(padding + 210, padding + 35, 'Lv.1', {
      font: '16px monospace',
      fill: '#00ffff',
    });

    // 攻击力文本
    this.attackText = this.add.text(padding, padding + 55, 'ATK: 0', {
      font: '16px monospace',
      fill: '#ff6600',
    });

    // 剩余敌人文本
    this.enemyCountText = this.add.text(padding, padding + 75, 'Enemies: 0/0', {
      font: '16px monospace',
      fill: '#ff0000',
    });

    // 分数文本
    this.scoreText = this.add.text(GameConfig.width - padding, padding, 'Score: 0', {
      font: '24px monospace',
      fill: '#ffff00',
    }).setOrigin(1, 0);

    // 波次文本
    this.waveText = this.add.text(GameConfig.width - padding, padding + 40, 'Wave: 1', {
      font: '20px monospace',
      fill: '#ff8800',
    }).setOrigin(1, 0);

    // 时间文本
    this.timeText = this.add.text(GameConfig.width / 2, padding, '00:00', {
      font: '24px monospace',
      fill: '#ffffff',
    }).setOrigin(0.5, 0);

    // 暂停按钮
    this.pauseButton = this.add.text(GameConfig.width / 2, padding + 40, '⏸️ 暂停 (ESC)', {
      font: '18px monospace',
      fill: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });

    this.pauseButton.on('pointerdown', () => {
      this.togglePause();
    });

    this.pauseButton.on('pointerover', () => {
      this.pauseButton.setStyle({ backgroundColor: '#555555' });
    });

    this.pauseButton.on('pointerout', () => {
      this.pauseButton.setStyle({ backgroundColor: '#333333' });
    });
  }

  updateUI() {
    // 更新血条
    const healthPercent = this.player.health / this.player.maxHealth;
    this.healthBar.clear();
    this.healthBar.fillStyle(healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.25 ? 0xffff00 : 0xff0000, 1);
    this.healthBar.fillRect(20, 20, 200 * healthPercent, 20);

    this.healthText.setText(`${Math.ceil(this.player.health)}/${this.player.maxHealth}`);

    // 更新经验条
    const xpPercent = this.player.xp / this.player.xpToNextLevel;
    this.xpBar.clear();
    this.xpBar.fillStyle(0x00ffff, 1);
    this.xpBar.fillRect(20, 50, 200 * xpPercent, 10);

    // 更新等级
    this.levelText.setText(`Lv.${this.player.level}`);

    // 更新攻击力
    const totalAttack = Math.ceil(this.player.attackPower);
    this.attackText.setText(`ATK: ${totalAttack}`);

    // 更新剩余敌人数
    const remainingEnemies = this.enemies.getChildren().filter(e => e.active).length;
    this.enemyCountText.setText(`Enemies: ${remainingEnemies}/${this.currentWaveEnemyCount}`);
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      // 显示暂停界面
      this.showPauseMenu();
      this.pauseButton.setText('▶️ 继续 (ESC)');
    } else {
      // 隐藏暂停界面
      this.hidePauseMenu();
      this.pauseButton.setText('⏸️ 暂停 (ESC)');
    }
  }

  showPauseMenu() {
    // 创建半透明遮罩
    this.pauseOverlay = this.add.graphics();
    this.pauseOverlay.fillStyle(0x000000, 0.7);
    this.pauseOverlay.fillRect(0, 0, GameConfig.width, GameConfig.height);
    this.pauseOverlay.setDepth(200);

    // 暂停文字
    this.pauseText = this.add.text(GameConfig.width / 2, GameConfig.height / 2 - 50, '游戏暂停', {
      font: '64px monospace',
      fill: '#ffffff',
    }).setOrigin(0.5).setDepth(201);

    // 继续按钮
    this.resumeButton = this.add.text(GameConfig.width / 2, GameConfig.height / 2 + 50, '继续游戏', {
      font: '32px monospace',
      fill: '#00ff00',
      backgroundColor: '#003300',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setDepth(201).setInteractive({ useHandCursor: true });

    this.resumeButton.on('pointerover', () => {
      this.resumeButton.setStyle({ fill: '#ffffff', backgroundColor: '#00ff00' });
    });

    this.resumeButton.on('pointerout', () => {
      this.resumeButton.setStyle({ fill: '#00ff00', backgroundColor: '#003300' });
    });

    this.resumeButton.on('pointerdown', () => {
      this.togglePause();
    });

    // 返回菜单按钮
    this.quitButton = this.add.text(GameConfig.width / 2, GameConfig.height / 2 + 120, '返回菜单', {
      font: '24px monospace',
      fill: '#ff0000',
      backgroundColor: '#330000',
      padding: { x: 15, y: 8 },
    }).setOrigin(0.5).setDepth(201).setInteractive({ useHandCursor: true });

    this.quitButton.on('pointerover', () => {
      this.quitButton.setStyle({ fill: '#ffffff', backgroundColor: '#ff0000' });
    });

    this.quitButton.on('pointerout', () => {
      this.quitButton.setStyle({ fill: '#ff0000', backgroundColor: '#330000' });
    });

    this.quitButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }

  hidePauseMenu() {
    if (this.pauseOverlay) {
      this.pauseOverlay.destroy();
      this.pauseText.destroy();
      this.resumeButton.destroy();
      this.quitButton.destroy();
    }
  }

  updateTimeText() {
    const minutes = Math.floor(this.gameTime / 60);
    const seconds = this.gameTime % 60;
    this.timeText.setText(
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
  }

  startWave() {
    // 检查是否是Boss波
    const isBossWave = this.wave % GameConfig.waves.bossInterval === 0;

    if (isBossWave) {
      this.spawnBoss();
    } else {
      this.spawnWave();
    }

    this.waveText.setText(`Wave: ${this.wave}`);
  }

  spawnWave() {
    const enemyCount = GameConfig.waves.baseEnemyCount +
      (this.wave - 1) * GameConfig.waves.enemyIncrement;

    this.currentWaveEnemyCount = enemyCount;
    this.currentWaveKilled = 0;

    const enemyTypes = ['zombie', 'runner', 'tank'];

    for (let i = 0; i < enemyCount; i++) {
      this.time.delayedCall(i * GameConfig.waves.spawnInterval, () => {
        const type = Phaser.Utils.Array.GetRandom(enemyTypes);
        this.spawnEnemy(type);
      });
    }

    // 波次完成检测
    this.time.delayedCall(enemyCount * GameConfig.waves.spawnInterval + 10000, () => {
      if (this.enemies.getChildren().filter(e => e.active).length === 0) {
        this.wave++;
        this.startWave();
      }
    });
  }

  spawnBoss() {
    const x = Phaser.Math.Between(100, GameConfig.width - 100);
    const y = Phaser.Math.Between(100, GameConfig.height - 100);

    const boss = new Enemy(this, x, y, 'boss');
    this.enemies.add(boss);

    this.currentWaveEnemyCount = 1;
    this.currentWaveKilled = 0;

    // Boss出现提示
    const warningText = this.add.text(GameConfig.width / 2, GameConfig.height / 2,
      'BOSS 来袭!', {
      font: '64px monospace',
      fill: '#ff0000',
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5).setDepth(150);

    this.tweens.add({
      targets: warningText,
      alpha: 0,
      scale: 2,
      duration: 2000,
      onComplete: () => {
        warningText.destroy();
      }
    });

    // Boss击败后开始下一波
    const checkBoss = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!boss.active) {
          checkBoss.remove();
          this.wave++;
          this.time.delayedCall(3000, () => {
            this.startWave();
          });
        }
      },
      loop: true
    });
  }

  spawnEnemy(type) {
    // 在屏幕边缘生成敌人
    const side = Phaser.Math.Between(0, 3);
    let x, y;

    switch (side) {
      case 0: // 上
        x = Phaser.Math.Between(0, GameConfig.width);
        y = -50;
        break;
      case 1: // 右
        x = GameConfig.width + 50;
        y = Phaser.Math.Between(0, GameConfig.height);
        break;
      case 2: // 下
        x = Phaser.Math.Between(0, GameConfig.width);
        y = GameConfig.height + 50;
        break;
      case 3: // 左
        x = -50;
        y = Phaser.Math.Between(0, GameConfig.height);
        break;
    }

    const enemy = new Enemy(this, x, y, type);
    this.enemies.add(enemy);
  }

  spawnXP(x, y, value) {
    const gem = new XPGem(this, x, y, value);
    this.xpGems.add(gem);
  }

  bulletHitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.takeDamage(bullet.damage);

    if (!enemy.active) {
      this.player.onKillEnemy();
      this.currentWaveKilled++;
    }
  }

  collectXP(player, gem) {
    gem.collect(player);
  }

  addScore(points) {
    this.score += points;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  showLevelUpUI() {
    this.isPaused = true;

    // 创建半透明遮罩
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, GameConfig.width, GameConfig.height);
    overlay.setDepth(100);

    // 标题
    const title = this.add.text(GameConfig.width / 2, 150, '升级!', {
      font: '48px monospace',
      fill: '#ffff00',
    }).setOrigin(0.5).setDepth(101);

    // 生成3个随机升级选项
    const upgradeKeys = Object.keys(GameConfig.upgrades);
    const selectedUpgrades = Phaser.Utils.Array.Shuffle([...upgradeKeys]).slice(0, 3);

    const startY = 250;
    const spacing = 120;

    // 存储所有选项的UI元素，方便统一清理
    const uiElements = [];

    selectedUpgrades.forEach((key, index) => {
      const upgrade = GameConfig.upgrades[key];
      const y = startY + index * spacing;

      // 选项背景
      const bg = this.add.graphics();
      bg.fillStyle(0x333333, 1);
      bg.fillRoundedRect(GameConfig.width / 2 - 300, y - 40, 600, 100, 10);
      bg.setDepth(101);
      bg.setInteractive(
        new Phaser.Geom.Rectangle(GameConfig.width / 2 - 300, y - 40, 600, 100),
        Phaser.Geom.Rectangle.Contains
      );

      // 升级名称
      const nameText = this.add.text(GameConfig.width / 2, y - 10, upgrade.name, {
        font: '28px monospace',
        fill: '#ffffff',
      }).setOrigin(0.5).setDepth(102);

      // 升级描述
      const descText = this.add.text(GameConfig.width / 2, y + 20, upgrade.description, {
        font: '18px monospace',
        fill: '#cccccc',
      }).setOrigin(0.5).setDepth(102);

      // 将这个选项的UI元素存入数组
      uiElements.push({ bg, nameText, descText });

      // 鼠标悬停效果
      bg.on('pointerover', () => {
        bg.clear();
        bg.fillStyle(0x555555, 1);
        bg.fillRoundedRect(GameConfig.width / 2 - 300, y - 40, 600, 100, 10);
      });

      bg.on('pointerout', () => {
        bg.clear();
        bg.fillStyle(0x333333, 1);
        bg.fillRoundedRect(GameConfig.width / 2 - 300, y - 40, 600, 100, 10);
      });

      // 点击选择
      bg.on('pointerdown', () => {
        this.player.applyUpgrade(upgrade);

        // 销毁遮罩和标题
        overlay.destroy();
        title.destroy();

        // 销毁所有选项的UI元素
        uiElements.forEach(element => {
          element.bg.destroy();
          element.nameText.destroy();
          element.descText.destroy();
        });

        this.isPaused = false;
      });
    });
  }

  gameOver() {
    // 保存游戏数据
    this.saveGameData();

    // 切换到游戏结束场景
    this.scene.start('GameOverScene', {
      score: this.score,
      wave: this.wave,
      kills: this.player.kills,
      time: this.gameTime,
    });
  }

  saveGameData() {
    const savedData = this.getSaveData();

    // 更新最高分
    if (this.score > savedData.highScore) {
      savedData.highScore = this.score;
    }

    // 保存已解锁武器
    this.player.weapons.forEach(weapon => {
      if (!savedData.unlockedWeapons.includes(weapon)) {
        savedData.unlockedWeapons.push(weapon);
      }
    });

    localStorage.setItem('roguelikeShooterSave', JSON.stringify(savedData));
  }

  getSaveData() {
    const data = localStorage.getItem('roguelikeShooterSave');
    if (data) {
      return JSON.parse(data);
    }
    return { highScore: 0, unlockedWeapons: ['pistol'] };
  }
}

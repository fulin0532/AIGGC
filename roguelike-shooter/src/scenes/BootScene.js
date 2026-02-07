import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // 创建加载进度条
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(440, 320, 400, 50);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: '加载中...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 + 15,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    // 更新进度条
    this.load.on('progress', (value) => {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(450, 330, 380 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // 这里将加载游戏资源
    // 暂时使用占位符
    this.createPlaceholderAssets();
  }

  createPlaceholderAssets() {
    // 创建占位符图形作为临时资源
    // 玩家 - 可爱的柯基
    this.createCorgiSprite();

    // 子弹
    const bulletGraphics = this.add.graphics();
    bulletGraphics.fillStyle(0xffff00, 1);
    bulletGraphics.fillCircle(4, 4, 4);
    bulletGraphics.generateTexture('bullet', 8, 8);
    bulletGraphics.destroy();

    // 僵尸敌人
    const zombieGraphics = this.add.graphics();
    zombieGraphics.fillStyle(0xff0000, 1);
    zombieGraphics.fillRect(0, 0, 28, 28);
    zombieGraphics.generateTexture('zombie', 28, 28);
    zombieGraphics.destroy();

    // 奔跑者敌人
    const runnerGraphics = this.add.graphics();
    runnerGraphics.fillStyle(0xff6600, 1);
    runnerGraphics.fillRect(0, 0, 24, 24);
    runnerGraphics.generateTexture('runner', 24, 24);
    runnerGraphics.destroy();

    // 坦克敌人
    const tankGraphics = this.add.graphics();
    tankGraphics.fillStyle(0x660000, 1);
    tankGraphics.fillRect(0, 0, 40, 40);
    tankGraphics.generateTexture('tank', 40, 40);
    tankGraphics.destroy();

    // Boss
    const bossGraphics = this.add.graphics();
    bossGraphics.fillStyle(0x8800ff, 1);
    bossGraphics.fillRect(0, 0, 64, 64);
    bossGraphics.generateTexture('boss', 64, 64);
    bossGraphics.destroy();

    // 经验宝石
    const xpGraphics = this.add.graphics();
    xpGraphics.fillStyle(0x00ffff, 1);
    xpGraphics.fillCircle(6, 6, 6);
    xpGraphics.generateTexture('xp', 12, 12);
    xpGraphics.destroy();
  }

  createCorgiSprite() {
    // 创建一个可爱的像素风格柯基
    const corgi = this.add.graphics();

    // 身体颜色
    const bodyColor = 0xD2691E; // 棕色
    const whiteColor = 0xFFFFFF; // 白色
    const blackColor = 0x000000; // 黑色
    const noseColor = 0x8B4513; // 深棕色

    // 身体（矩形）
    corgi.fillStyle(bodyColor, 1);
    corgi.fillRect(8, 12, 16, 12); // 身体

    // 白色肚子
    corgi.fillStyle(whiteColor, 1);
    corgi.fillRect(10, 16, 12, 8);

    // 头部
    corgi.fillStyle(bodyColor, 1);
    corgi.fillRect(4, 8, 12, 8); // 头

    // 白色脸颊
    corgi.fillStyle(whiteColor, 1);
    corgi.fillRect(6, 10, 8, 4);

    // 耳朵（左右）
    corgi.fillStyle(bodyColor, 1);
    corgi.fillRect(4, 6, 3, 4); // 左耳
    corgi.fillRect(13, 6, 3, 4); // 右耳

    // 眼睛（左右）
    corgi.fillStyle(blackColor, 1);
    corgi.fillRect(7, 10, 2, 2); // 左眼
    corgi.fillRect(11, 10, 2, 2); // 右眼

    // 鼻子
    corgi.fillStyle(noseColor, 1);
    corgi.fillRect(9, 13, 2, 2);

    // 短腿（柯基特色！）
    corgi.fillStyle(bodyColor, 1);
    corgi.fillRect(10, 24, 3, 4); // 左前腿
    corgi.fillRect(17, 24, 3, 4); // 右前腿
    corgi.fillRect(10, 24, 3, 4); // 左后腿
    corgi.fillRect(17, 24, 3, 4); // 右后腿

    // 白色爪子
    corgi.fillStyle(whiteColor, 1);
    corgi.fillRect(10, 26, 3, 2); // 左前爪
    corgi.fillRect(17, 26, 3, 2); // 右前爪

    // 尾巴（可爱的小尾巴）
    corgi.fillStyle(bodyColor, 1);
    corgi.fillRect(24, 14, 4, 3);

    // 尾巴尖端（白色）
    corgi.fillStyle(whiteColor, 1);
    corgi.fillRect(26, 14, 2, 3);

    corgi.generateTexture('player', 32, 32);
    corgi.destroy();
  }

  create() {
    // 加载完成，切换到菜单场景
    this.scene.start('MenuScene');
  }
}

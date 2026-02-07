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

    // 僵尸球球 - 红色小球（慢悠悠）
    const zombieGraphics = this.add.graphics();
    // 主体球
    zombieGraphics.fillStyle(0xff4444, 1);
    zombieGraphics.fillCircle(14, 14, 12);
    // 高光效果
    zombieGraphics.fillStyle(0xff8888, 0.6);
    zombieGraphics.fillCircle(10, 10, 4);
    // 可爱的表情
    zombieGraphics.fillStyle(0x000000, 1);
    zombieGraphics.fillCircle(10, 12, 2); // 左眼
    zombieGraphics.fillCircle(18, 12, 2); // 右眼
    zombieGraphics.fillStyle(0xff0000, 1);
    zombieGraphics.fillEllipse(14, 18, 6, 3); // 嘴巴
    zombieGraphics.generateTexture('zombie', 28, 28);
    zombieGraphics.destroy();

    // 奔跑者球球 - 橙色小球（快速弹跳）
    const runnerGraphics = this.add.graphics();
    // 主体球
    runnerGraphics.fillStyle(0xff8800, 1);
    runnerGraphics.fillCircle(12, 12, 10);
    // 高光
    runnerGraphics.fillStyle(0xffbb44, 0.6);
    runnerGraphics.fillCircle(9, 9, 3);
    // 兴奋表情
    runnerGraphics.fillStyle(0x000000, 1);
    runnerGraphics.fillCircle(8, 10, 2); // 左眼
    runnerGraphics.fillCircle(16, 10, 2); // 右眼
    runnerGraphics.beginPath();
    runnerGraphics.arc(12, 13, 4, 0, Math.PI); // 笑脸
    runnerGraphics.strokePath();
    runnerGraphics.generateTexture('runner', 24, 24);
    runnerGraphics.destroy();

    // 坦克球球 - 深红色大球（又大又硬）
    const tankGraphics = this.add.graphics();
    // 主体球
    tankGraphics.fillStyle(0x880000, 1);
    tankGraphics.fillCircle(20, 20, 18);
    // 高光
    tankGraphics.fillStyle(0xaa3333, 0.5);
    tankGraphics.fillCircle(14, 14, 6);
    // 凶狠表情
    tankGraphics.fillStyle(0xff0000, 1);
    tankGraphics.fillCircle(14, 18, 2); // 左眼
    tankGraphics.fillCircle(26, 18, 2); // 右眼
    tankGraphics.fillStyle(0x000000, 1);
    tankGraphics.fillRect(16, 26, 8, 3); // 咬牙
    tankGraphics.generateTexture('tank', 40, 40);
    tankGraphics.destroy();

    // Boss球球 - 巨大紫色魔法球
    const bossGraphics = this.add.graphics();
    // 魔法光环
    bossGraphics.fillStyle(0xaa00ff, 0.3);
    bossGraphics.fillCircle(32, 32, 30);
    // 主体球
    bossGraphics.fillStyle(0x8800ff, 1);
    bossGraphics.fillCircle(32, 32, 26);
    // 多层高光（魔法效果）
    bossGraphics.fillStyle(0xbb44ff, 0.6);
    bossGraphics.fillCircle(24, 24, 8);
    bossGraphics.fillStyle(0xdd88ff, 0.4);
    bossGraphics.fillCircle(20, 20, 4);
    // Boss眼神
    bossGraphics.fillStyle(0xff0000, 1);
    bossGraphics.fillCircle(24, 30, 3); // 左眼（发红光）
    bossGraphics.fillCircle(40, 30, 3); // 右眼
    // 王冠符号
    bossGraphics.fillStyle(0xffff00, 1);
    bossGraphics.fillRect(28, 18, 8, 4); // 简化的王冠
    bossGraphics.generateTexture('boss', 64, 64);
    bossGraphics.destroy();

    // 经验宝石 - 闪亮的星星形
    const xpGraphics = this.add.graphics();
    xpGraphics.fillStyle(0x00ffff, 1);
    xpGraphics.fillCircle(6, 6, 6);
    xpGraphics.fillStyle(0xffffff, 0.8);
    xpGraphics.fillCircle(4, 4, 2); // 闪光
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

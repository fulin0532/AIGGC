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
    // 玩家
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0x00ff00, 1);
    playerGraphics.fillRect(0, 0, 32, 32);
    playerGraphics.generateTexture('player', 32, 32);
    playerGraphics.destroy();

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

  create() {
    // 加载完成，切换到菜单场景
    this.scene.start('MenuScene');
  }
}

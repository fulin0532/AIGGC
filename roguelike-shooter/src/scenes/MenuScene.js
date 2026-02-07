import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 游戏标题
    const title = this.add.text(width / 2, height / 3, 'ROGUELIKE SHOOTER', {
      font: '64px monospace',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    });
    title.setOrigin(0.5);

    // 副标题
    const subtitle = this.add.text(width / 2, height / 3 + 80, '肉鸽射击游戏', {
      font: '24px monospace',
      fill: '#cccccc',
    });
    subtitle.setOrigin(0.5);

    // 开始按钮
    const startButton = this.add.text(width / 2, height / 2 + 50, '开始游戏', {
      font: '32px monospace',
      fill: '#00ff00',
      backgroundColor: '#003300',
      padding: { x: 20, y: 10 },
    });
    startButton.setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });

    startButton.on('pointerover', () => {
      startButton.setStyle({ fill: '#ffffff', backgroundColor: '#00ff00' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ fill: '#00ff00', backgroundColor: '#003300' });
    });

    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // 显示最高分
    const savedData = this.getSaveData();
    if (savedData.highScore > 0) {
      const highScoreText = this.add.text(width / 2, height / 2 + 150,
        `最高分: ${savedData.highScore}`, {
        font: '24px monospace',
        fill: '#ffff00',
      });
      highScoreText.setOrigin(0.5);
    }

    // 操作说明
    const controls = this.add.text(width / 2, height - 100,
      'WASD - 移动 | 自动射击最近的敌人', {
      font: '18px monospace',
      fill: '#888888',
    });
    controls.setOrigin(0.5);
  }

  getSaveData() {
    const data = localStorage.getItem('roguelikeShooterSave');
    if (data) {
      return JSON.parse(data);
    }
    return { highScore: 0, unlockedWeapons: ['pistol'] };
  }
}

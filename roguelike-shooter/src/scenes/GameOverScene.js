import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.finalWave = data.wave || 1;
    this.finalKills = data.kills || 0;
    this.finalTime = data.time || 0;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 游戏结束标题
    const title = this.add.text(width / 2, 100, 'GAME OVER', {
      font: '64px monospace',
      fill: '#ff0000',
      stroke: '#000000',
      strokeThickness: 4,
    });
    title.setOrigin(0.5);

    // 统计信息
    const statsY = 220;
    const lineHeight = 50;

    this.add.text(width / 2, statsY, `最终分数: ${this.finalScore}`, {
      font: '32px monospace',
      fill: '#ffff00',
    }).setOrigin(0.5);

    this.add.text(width / 2, statsY + lineHeight, `存活波次: ${this.finalWave}`, {
      font: '28px monospace',
      fill: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(width / 2, statsY + lineHeight * 2, `击杀数: ${this.finalKills}`, {
      font: '28px monospace',
      fill: '#ffffff',
    }).setOrigin(0.5);

    const minutes = Math.floor(this.finalTime / 60);
    const seconds = this.finalTime % 60;
    this.add.text(width / 2, statsY + lineHeight * 3,
      `存活时间: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, {
      font: '28px monospace',
      fill: '#ffffff',
    }).setOrigin(0.5);

    // 最高分
    const savedData = this.getSaveData();
    this.add.text(width / 2, statsY + lineHeight * 4 + 20,
      `历史最高分: ${savedData.highScore}`, {
      font: '24px monospace',
      fill: '#00ff00',
    }).setOrigin(0.5);

    // 重新开始按钮
    const restartButton = this.add.text(width / 2, height - 150, '重新开始', {
      font: '32px monospace',
      fill: '#00ff00',
      backgroundColor: '#003300',
      padding: { x: 20, y: 10 },
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive({ useHandCursor: true });

    restartButton.on('pointerover', () => {
      restartButton.setStyle({ fill: '#ffffff', backgroundColor: '#00ff00' });
    });

    restartButton.on('pointerout', () => {
      restartButton.setStyle({ fill: '#00ff00', backgroundColor: '#003300' });
    });

    restartButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // 返回菜单按钮
    const menuButton = this.add.text(width / 2, height - 80, '返回菜单', {
      font: '24px monospace',
      fill: '#888888',
      backgroundColor: '#222222',
      padding: { x: 15, y: 8 },
    });
    menuButton.setOrigin(0.5);
    menuButton.setInteractive({ useHandCursor: true });

    menuButton.on('pointerover', () => {
      menuButton.setStyle({ fill: '#ffffff', backgroundColor: '#444444' });
    });

    menuButton.on('pointerout', () => {
      menuButton.setStyle({ fill: '#888888', backgroundColor: '#222222' });
    });

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }

  getSaveData() {
    const data = localStorage.getItem('roguelikeShooterSave');
    if (data) {
      return JSON.parse(data);
    }
    return { highScore: 0, unlockedWeapons: ['pistol'] };
  }
}

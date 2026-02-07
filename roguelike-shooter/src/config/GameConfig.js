// 游戏配置常量
export const GameConfig = {
  // 游戏尺寸
  width: 1280,
  height: 720,

  // 玩家属性
  player: {
    speed: 200,
    maxHealth: 100,
    baseAttack: 10,
    attackSpeed: 1.0, // 每秒攻击次数
  },

  // 武器配置
  weapons: {
    pistol: {
      name: '手枪',
      damage: 15,
      fireRate: 500, // 毫秒
      projectileSpeed: 400,
      range: 500,
    },
    rifle: {
      name: '步枪',
      damage: 10,
      fireRate: 200,
      projectileSpeed: 600,
      range: 600,
    },
    shotgun: {
      name: '霰弹枪',
      damage: 8,
      fireRate: 800,
      projectileSpeed: 300,
      range: 300,
      pellets: 5, // 每次发射5颗弹丸
    },
  },

  // 敌人配置
  enemies: {
    zombie: {
      name: '僵尸',
      health: 30,
      speed: 80,
      damage: 10,
      score: 10,
      xp: 5,
    },
    runner: {
      name: '奔跑者',
      health: 20,
      speed: 150,
      damage: 5,
      score: 15,
      xp: 8,
    },
    tank: {
      name: '坦克',
      health: 100,
      speed: 50,
      damage: 20,
      score: 50,
      xp: 20,
    },
  },

  // Boss配置
  boss: {
    name: '恶魔领主',
    health: 500,
    speed: 120,
    damage: 25,
    score: 500,
    xp: 100,
  },

  // 波次配置
  waves: {
    baseEnemyCount: 5,
    enemyIncrement: 3, // 每波增加的敌人数
    bossInterval: 5, // 每5波出现Boss
    spawnInterval: 2000, // 生成间隔(毫秒)
  },

  // 升级配置
  levelUp: {
    baseXP: 20,
    xpMultiplier: 1.5, // 每级所需经验倍数
  },

  // 升级选项
  upgrades: {
    healthBoost: {
      name: '💊 生命提升',
      description: '最大生命值+20',
      effect: { maxHealth: 20 },
    },
    healthBoostLarge: {
      name: '💊💊 大生命提升',
      description: '最大生命值+50',
      effect: { maxHealth: 50 },
    },
    speedBoost: {
      name: '⚡ 速度提升',
      description: '移动速度+15%',
      effect: { speed: 1.15 },
    },
    speedBoostLarge: {
      name: '⚡⚡ 大速度提升',
      description: '移动速度+30%',
      effect: { speed: 1.3 },
    },
    damageBoost: {
      name: '⚔️ 伤害提升',
      description: '攻击力+20%',
      effect: { damage: 1.2 },
    },
    damageBoostLarge: {
      name: '⚔️⚔️ 大伤害提升',
      description: '攻击力+50%',
      effect: { damage: 1.5 },
    },
    attackSpeedBoost: {
      name: '🔥 攻速提升',
      description: '攻击速度+25%',
      effect: { attackSpeed: 1.25 },
    },
    attackSpeedBoostLarge: {
      name: '🔥🔥 大攻速提升',
      description: '攻击速度+50%',
      effect: { attackSpeed: 1.5 },
    },
    projectileRangeBoost: {
      name: '🎯 射程提升',
      description: '武器射程+30%',
      effect: { range: 1.3 },
    },
    projectileSpeedBoost: {
      name: '🚀 弹速提升',
      description: '子弹速度+40%',
      effect: { projectileSpeed: 1.4 },
    },
    healNow: {
      name: '❤️ 立即治疗',
      description: '恢复50点生命值',
      effect: { healNow: 50 },
    },
    xpBoost: {
      name: '✨ 经验加成',
      description: '经验获取+50%',
      effect: { xpMultiplier: 1.5 },
    },
    criticalChance: {
      name: '💥 暴击几率',
      description: '15%几率造成双倍伤害',
      effect: { criticalChance: 0.15 },
    },
    lifeSteal: {
      name: '🩸 生命偷取',
      description: '击杀敌人恢复5点生命',
      effect: { lifeSteal: 5 },
    },
    newWeapon: {
      name: '🔫 新武器',
      description: '解锁一把新武器',
      effect: { newWeapon: true },
    },
  },
};

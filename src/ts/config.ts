type PlayerSetting = {
  acceleration: number;
  maxSpeed: number;
  radius: number;
};

type WeponsSetting = {
  rate: number;
  radius: number;
};

type QTreeSetting = {
  maxLevel: number;
};

type EnemySetting = {
  radius: number;
  particleNumSqrt: number;
};

type Config = {
  QTree: QTreeSetting;
  player: PlayerSetting;
  bullet: WeponsSetting;
  enemy: EnemySetting;
};

const config: Config = {
  QTree: {
    maxLevel: 2,
  },
  player: {
    acceleration: 0.1,
    maxSpeed: 0.5,
    radius: 5,
  },
  bullet: {
    rate: 100,
    radius: 2,
  },
  enemy: {
    radius: 10,
    particleNumSqrt: 512,
  },
} as const;
export default config;

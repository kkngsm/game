type PlayerSetting = {
  acceleration: number;
  maxSpeed: number;
  size: number;
};

type WeponsSetting = {
  rate: number;
  size: number;
};

type QTreeSetting = {
  maxLevel: number;
};

type EnemySetting = {
  size: number;
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
    size: 10,
  },
  bullet: {
    rate: 50,
    size: 5,
  },
  enemy: {
    size: 10,
  },
} as const;
export default config;

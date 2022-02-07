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
    rate: 50,
    radius: 2,
  },
  enemy: {
    radius: 10,
  },
} as const;
export default config;

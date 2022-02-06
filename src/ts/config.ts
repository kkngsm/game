type PlayerSetting = {
  acceleration: number;
  maxSpeed: number;
};

type WeponsSetting = {
  rate: number;
};

type QTreeSetting = {
  maxLevel: number;
};

type Config = {
  QTree: QTreeSetting;
  player: PlayerSetting;
  bullet: WeponsSetting;
};

const config: Config = {
  QTree: {
    maxLevel: 2,
  },
  player: {
    acceleration: 0.1,
    maxSpeed: 0.5,
  },
  bullet: {
    rate: 50,
  },
} as const;
export default config;

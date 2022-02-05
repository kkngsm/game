type PlayerSetting = {
  acceleration: number;
  maxSpeed: number;
};

type WeponsSetting = {
  rate: number;
};

type Config = {
  player: PlayerSetting;
  bullet: WeponsSetting;
};

const config: Config = {
  player: {
    acceleration: 0.1,
    maxSpeed: 0.5,
  },
  bullet: {
    rate: 50,
  },
} as const;
export default config;

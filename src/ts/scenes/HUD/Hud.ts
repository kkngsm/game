import { GameProps, MainInfos, RenderProps } from "../../../types/type";
import config from "../../config";

export class Hud {
  constructor(
    private gps: GameProps,
    private rps: RenderProps,
    private infos: MainInfos
  ) {}
  /**
   * HUDの描画
   */
  draw() {
    const { ctx2D } = this.rps;
    const { windowSize } = this.gps;

    ctx2D.fillStyle = "red";
    ctx2D.fillRect(
      50 + windowSize.x * 0.5,
      50,
      (windowSize.x * 0.5 - 100) * (this.infos.enemyHP.hp / config.enemy.hp),
      40
    );
    ctx2D.fillRect(
      50,
      50,
      (windowSize.x * 0.5 - 100) * (this.infos.playerHP.hp / config.player.hp),
      40
    );
  }
}

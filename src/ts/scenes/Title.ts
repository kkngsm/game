import { GameProps, RenderProps } from "../../types/type";
import { Scene, State } from "./Scene";
export default class Title extends Scene {
  constructor(gp: GameProps, sp: RenderProps) {
    super(gp, sp);
  }
  async run(): Promise<State> {
    const { key } = this.gps;
    return new Promise<void>((resolve) => {
      const loop = (time: number) => {
        this.draw();
        if (!key.enter) {
          requestAnimationFrame(loop);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(loop);
    }).then(() => {
      return "Battle" as State;
    });
  }
  private draw(): void {
    const { ctx2D } = this.rps;
    const { windowSize } = this.gps;

    ctx2D.fillStyle = "gray";
    ctx2D.font = "bold 100px Arial, meiryo, sans-serif";
    ctx2D.fillText("TITLE", windowSize.x * 0.3, windowSize.y * 0.5);
    ctx2D.fillText("Press Enter", windowSize.x * 0.3, windowSize.y * 0.7);
  }
}

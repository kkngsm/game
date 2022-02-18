import { GameProps, RenderProps } from "../../types/type";
import { Scene, State } from "./Scene";

export default class Result extends Scene {
  constructor(gp: GameProps, sp: RenderProps) {
    super(gp, sp);
  }

  async run(): Promise<State> {
    this.draw();
    return "End" as State;
  }
  private draw() {
    const { ctx2D } = this.rps;
    const { windowSize } = this.gps;

    ctx2D.fillStyle = "gray";
    ctx2D.font = "bold 100px Arial, meiryo, sans-serif";
    ctx2D.fillText("RESULT", windowSize.x * 0.25, windowSize.y * 0.5);
    ctx2D.fillText("Please Reload", windowSize.x * 0.3, windowSize.y * 0.75);
  }
}

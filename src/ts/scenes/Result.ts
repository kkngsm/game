import { Scene, SceneProps, State } from "./Scene";

export default class Result extends Scene {
  constructor(prop: SceneProps) {
    super(prop);
  }

  async run(): Promise<State> {
    this.draw();
    return "End" as State;
  }
  private draw() {
    this.ctx2D.fillStyle = "gray";
    this.ctx2D.font = "bold 100px Arial, meiryo, sans-serif";
    this.ctx2D.fillText(
      "RESULT",
      this.windowSize.x * 0.25,
      this.windowSize.y * 0.5
    );
    this.ctx2D.fillText(
      "Please Reload",
      this.windowSize.x * 0.3,
      this.windowSize.y * 0.75
    );
  }
}

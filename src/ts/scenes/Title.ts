import { Scene, SceneProps, State } from "./Scene";
export default class Title extends Scene {
  constructor(prop: SceneProps) {
    super(prop);
  }

  async run(): Promise<State> {
    return new Promise<void>((resolve) => {
      const loop = (time: number) => {
        this.draw();
        if (!this.key.enter) {
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
    this.ctx2D.fillStyle = "gray";
    this.ctx2D.font = "bold 100px Arial, meiryo, sans-serif";
    this.ctx2D.fillText(
      "TITLE",
      this.windowSize.x * 0.3,
      this.windowSize.y * 0.5
    );
    this.ctx2D.fillText(
      "Press Enter",
      this.windowSize.x * 0.3,
      this.windowSize.y * 0.7
    );
  }
}

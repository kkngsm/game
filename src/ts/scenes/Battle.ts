import { Scene, State } from "./Scene";
import { PostPass } from "../renderPass/PostPass";
import { Hud } from "./HUD/Hud";
import { GameProps, RenderProps } from "../../types/type";
import { MainPass } from "../renderPass/MainPass";
export default class Battle extends Scene {
  private main: MainPass;
  private post: PostPass;
  private hud: Hud;
  constructor(gps: GameProps, rps: RenderProps) {
    super(gps, rps);
  }
  public static async init(gps: GameProps, rps: RenderProps) {
    const battle = new Battle(gps, rps);
    await battle.set();
    return battle;
  }
  async run(): Promise<State> {
    let prevTime = 0;
    return new Promise<void>((resolve) => {
      const loop = (time: number) => {
        this.operation(time);
        const next = this.update(time, prevTime);
        this.draw();

        prevTime = time;
        if (next) {
          requestAnimationFrame(loop);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(loop);
    }).then(() => {
      return "Result" as State;
    });
  }

  private update(time: number, prevTime: number): boolean {
    return this.main.update(time, prevTime);
  }
  private draw(): void {
    const { renderer, ctx2D } = this.rps;
    const { windowSize } = this.gps;
    ctx2D.clearRect(0, 0, windowSize.x, windowSize.y);
    this.main.render();
    this.post.render();
    ctx2D.drawImage(renderer.domElement, 0, 0, windowSize.x, windowSize.y);
    this.hud.draw();
  }
  private operation(time: number) {
    this.main.operation(time);
  }
  private async set() {
    this.main = await MainPass.init(this.gps, this.rps);
    this.hud = new Hud(this.gps, this.rps, this.main.getInfos());
    this.post = new PostPass(this.gps, this.rps, this.main.rawRender);
  }
}

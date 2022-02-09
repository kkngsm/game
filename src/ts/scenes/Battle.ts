import { LinearFilter, RGBAFormat, UnsignedByteType } from "three";
import MainPass from "../renderPass/MainPass";
import { WebGLDefferdRenderTargets } from "../WebGLDefferdRenderTargets";
import { Scene, SceneProps, State } from "./Scene";
import { PostPass } from "../renderPass/PostPass";
export default class Battle extends Scene {
  private main: MainPass;
  private post: PostPass;
  private rawRender: WebGLDefferdRenderTargets;
  constructor(prop: SceneProps) {
    super(prop);
  }
  public static async init(props: SceneProps) {
    const battle = new Battle(props);
    await battle.set();
    return battle;
  }
  async run(): Promise<State> {
    return new Promise<void>((resolve) => {
      const loop = (time: number) => {
        this.operation(time);
        const next = this.update(time);
        this.draw();
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

  private update(time: number): boolean {
    return this.main.update(time);
  }
  private draw(): void {
    this.main.render(this.renderer, this.rawRender);
    this.post.render(this.renderer, null);
    this.ctx2D.drawImage(
      this.renderer.domElement,
      0,
      0,
      this.windowSize.x,
      this.windowSize.y
    );
    this.ctx2D.fillStyle = "red";
    this.ctx2D.fillRect(
      50,
      50,
      (this.windowSize.x - 100) * this.main.getEnemyHp(),
      40
    );
  }
  private operation(time: number) {
    this.main.operation(time, this.key);
  }
  private async set() {
    this.main = await MainPass.init(this.windowSize);
    this.rawRender = new WebGLDefferdRenderTargets(
      this.windowSize.width,
      this.windowSize.height,
      [
        {
          name: "albedo",
          minFilter: LinearFilter,
          magFilter: LinearFilter,
          type: UnsignedByteType,
          format: RGBAFormat,
        },
        {
          name: "normal",
          minFilter: LinearFilter,
          magFilter: LinearFilter,
          type: UnsignedByteType,
          format: RGBAFormat,
        },
      ]
    );
    this.post = new PostPass(this.windowSize, this.rawRender);
  }
}

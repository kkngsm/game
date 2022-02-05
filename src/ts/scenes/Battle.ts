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
    this.main = new MainPass(this.size);
    this.rawRender = new WebGLDefferdRenderTargets(
      this.size.width,
      this.size.height,
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
    this.post = new PostPass(this.size, this.rawRender);
  }

  async run(): Promise<State> {
    return new Promise<void>((resolve) => {
      const loop = (time: number) => {
        this.operation(time);
        this.update();
        this.draw();
        if (!this.key.enter) {
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

  private update(): void {
    this.main.update();
  }
  private draw(): void {
    this.renderer.setRenderTarget(this.rawRender);
    this.renderer.render(this.main.scene, this.main.camera);

    this.post.render(this.renderer);
  }
  private operation(time: number) {
    this.main.operation(time, this.key);
  }
}

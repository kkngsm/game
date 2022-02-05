import { LinearFilter, RGBAFormat, UnsignedByteType } from "three";
import MainPath from "./object/MainPath";
import { WebGLDefferdRenderTargets } from "../../renderPath/WebGLDefferdRenderer";
import { Scene, SceneProps, State } from "../Scene";
import { BloomEffect } from "../../postEffects/Bloom";
export default class Battle extends Scene {
  private main: MainPath;
  private bloom: BloomEffect;
  private rawRender: WebGLDefferdRenderTargets;
  constructor(prop: SceneProps) {
    super(prop);
    this.main = new MainPath(this.size);
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
      ]
    );
    this.bloom = new BloomEffect(this.size, this.rawRender);
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
    this.renderer.clear();
    this.renderer.render(this.main.scene, this.main.camera);

    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.bloom.scene, this.bloom.camera);
  }
  private operation(time: number) {
    this.main.operation(time, this.key);
  }
}

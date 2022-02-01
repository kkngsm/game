import { PerspectiveCamera } from "three";
import Objects from "../object/Objects";
import { Scene, SceneProps, State } from "./Scene";
export default class Battle extends Scene {
  private camera: PerspectiveCamera;
  private objects: Objects;
  constructor(prop: SceneProps) {
    super(prop);
    this.objects = new Objects(this.size);
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
    this.objects.update();
  }
  private draw(): void {
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.objects.scene, this.objects.camera);
  }
  private operation(time: number) {
    this.objects.operation(time, this.key);
  }
}

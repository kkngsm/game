import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene as TScene,
  Vector3,
} from "three";
import { Scene, SceneProps, State } from "./Scene";
export default class Battle extends Scene {
  private scene: TScene;
  private camera: PerspectiveCamera;
  private cube: Mesh;
  constructor(prop: SceneProps) {
    super(prop);
    this.scene = new TScene();

    this.camera = new PerspectiveCamera(
      45,
      this.size.width / this.size.height,
      1,
      10000
    );
    this.camera.position.z = 100;
    this.camera.lookAt(new Vector3(0, 0, 0));

    const box = new BoxGeometry(10, 10, 10);
    const mat = new MeshBasicMaterial({ color: 0x1ec876 });
    this.cube = new Mesh(box, mat);
    this.cube.position.set(0, 0, 0);
    this.scene.add(this.cube);
  }

  async run(): Promise<State> {
    return new Promise<void>((resolve) => {
      const loop = (time: number) => {
        this.operation();
        this.draw(time);
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

  private draw(time: number): void {
    this.camera.lookAt(new Vector3(0, 0, 0));
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }

  private operation() {
    if (this.key.w) {
      this.cube.position.y = this.cube.position.y + 0.5;
    }
    if (this.key.a) {
      this.cube.position.x = this.cube.position.x - 0.5;
    }
    if (this.key.s) {
      this.cube.position.y = this.cube.position.y - 0.5;
    }
    if (this.key.d) {
      this.cube.position.x = this.cube.position.x + 0.5;
    }
  }
}

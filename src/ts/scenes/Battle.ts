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
    this.camera.position.y = 50;
    this.camera.lookAt(new Vector3(0, 0, 0));

    const box = new BoxGeometry(10, 10, 10);
    const mat = new MeshBasicMaterial({ color: 0x1ec876 });
    const cube = new Mesh(box, mat);
    cube.position.set(0, 0, 0);
    this.scene.add(cube);
  }

  async run(): Promise<State> {
    console.log("Battle");
    return new Promise<void>((resolve) => {
      const loop = (time: number) => {
        this.draw(time);
        if (!this.key.enter) {
          requestAnimationFrame((time) => {
            loop(time);
          });
        } else {
          resolve();
        }
      };
      requestAnimationFrame((time) => {
        loop(time);
      });
    }).then(() => {
      return "Result" as State;
    });
  }

  private draw(time: number): void {
    this.camera.position.x = Math.sin(time * 0.001) * 100;
    this.camera.position.z = Math.cos(time * 0.001) * 100;
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }
}

import { PerspectiveCamera, Scene as TScene, Vector3 } from "three";
import Player from "../Player";
import { Scene, SceneProps, State } from "./Scene";
export default class Battle extends Scene {
  private scene: TScene;
  private camera: PerspectiveCamera;
  private Player: Player;
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

    this.Player = new Player();
    this.Player.mesh.position.set(0, 0, 0);
    this.scene.add(this.Player.mesh);
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
    this.Player.operation(this.key);
  }
}

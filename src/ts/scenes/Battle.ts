import { PerspectiveCamera, Scene as TScene, Vector3 } from "three";
import Bullet from "../bullet/Bullet";
import Player from "../Player";
import { Scene, SceneProps, State } from "./Scene";
export default class Battle extends Scene {
  private scene: TScene;
  private camera: PerspectiveCamera;
  private player: Player;
  private bullets: Bullet[];
  constructor(prop: SceneProps) {
    super(prop);
    this.scene = new TScene();
    this.bullets = [];
    this.camera = new PerspectiveCamera(
      45,
      this.size.width / this.size.height,
      1,
      10000
    );
    this.camera.position.z = 100;
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.player = new Player();
    this.player.mesh.position.set(0, 0, 0);
    this.scene.add(this.player.mesh);
  }

  async run(): Promise<State> {
    return new Promise<void>((resolve) => {
      const loop = (time: number) => {
        this.operation();
        this.update();
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

  private update(): void {
    this.bullets.forEach((e) => e.update());
  }
  private draw(time: number): void {
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }

  private operation() {
    this.player.operation(this.key);
    if (this.key.space) {
      const bullet = new Bullet(this.player.pos);
      this.bullets.push(bullet);
      this.scene.add(bullet.mesh);
    }
  }
}

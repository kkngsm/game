import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Scene as TScene,
} from "three";
import { Scene, SceneProps, State } from "./Scene";
export default class Battle extends Scene {
  private scene: TScene;
  private camera: OrthographicCamera;
  constructor(prop: SceneProps) {
    super(prop);
    this.scene = new TScene();
    this.camera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 1, 10000);

    const geometry = new BoxGeometry(0.1, 0.1, 0.1);
    const material = new MeshBasicMaterial({ color: 0xffff00 });
    const mesh = new Mesh(geometry, material);
    this.scene.add(mesh);
  }

  async run(): Promise<State> {
    console.log("Battle");
    return new Promise<void>((resolve) => {
      const draw = (time: number) => {
        console.log("draw");
        this.renderer.setRenderTarget(null);
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        if (this.key.key !== "Enter") {
          requestAnimationFrame(() => {
            draw(time);
          });
        } else {
          resolve();
        }
      };
      requestAnimationFrame((time) => {
        draw(time);
      });
    }).then(() => {
      return "Result" as State;
    });
  }
}

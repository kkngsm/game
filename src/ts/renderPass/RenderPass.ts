import { Camera, Scene as TScene } from "three";
import { RenderProps } from "../../types/type";

export default abstract class RenderPass {
  protected camera: Camera;
  readonly scene: TScene;
  constructor(protected rps: RenderProps) {
    this.scene = new TScene();
  }
}

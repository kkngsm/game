import { Scene as TScene, Camera } from "three";

export default class RenderPass {
  readonly scene: TScene;
  readonly camera: Camera;
  constructor(camera: Camera) {
    this.scene = new TScene();
    this.camera = camera;
  }
}
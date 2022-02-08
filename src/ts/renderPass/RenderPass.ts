import {
  Scene as TScene,
  Camera,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { WebGLDefferdRenderTargets } from "../WebGLDefferdRenderTargets";

export default abstract class RenderPass {
  readonly scene: TScene;
  readonly camera: Camera;
  constructor(camera: Camera) {
    this.scene = new TScene();
    this.camera = camera;
  }
  abstract render(
    renderer: WebGLRenderer,
    renderTarget: WebGLRenderTarget | WebGLDefferdRenderTargets | null
  ): void;
}

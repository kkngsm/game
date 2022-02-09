import { Vector2, WebGLRenderer } from "three";
import { Key } from "../Key";

export type State = "Title" | "Battle" | "Result" | "End";

export type SceneProps = {
  ctx2D: CanvasRenderingContext2D;
  key: Key;
  renderer: WebGLRenderer;
  windowSize: Vector2;
  windowDownnerLeft: Vector2;
};
export abstract class Scene {
  protected ctx2D: CanvasRenderingContext2D;
  protected key: Key;
  protected renderer: WebGLRenderer;
  protected windowSize: Vector2;
  protected windowDownnerLeft: Vector2;
  constructor({
    ctx2D,
    key,
    renderer,
    windowSize,
    windowDownnerLeft,
  }: SceneProps) {
    this.ctx2D = ctx2D;
    this.key = key;
    this.renderer = renderer;
    this.windowSize = windowSize;
    this.windowDownnerLeft = windowDownnerLeft;
  }
}

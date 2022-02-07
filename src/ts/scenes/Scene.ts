import { Vector2, WebGLRenderer } from "three";
import { Key } from "../Key";

export type State = "Title" | "Battle" | "Result" | "End";

export type SceneProps = {
  key: Key;
  renderer: WebGLRenderer;
  windowSize: Vector2;
  windowDownnerLeft: Vector2;
};
export abstract class Scene {
  protected key: Key;
  protected renderer: WebGLRenderer;
  protected windowSize: Vector2;
  protected windowDownnerLeft: Vector2;
  constructor({ key, renderer, windowSize, windowDownnerLeft }: SceneProps) {
    this.key = key;
    this.renderer = renderer;
    this.windowSize = windowSize;
    this.windowDownnerLeft = windowDownnerLeft;
  }
}

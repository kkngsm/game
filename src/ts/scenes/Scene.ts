import { WebGLRenderer } from "three";
import { Key } from "../Key";

export type State = "Title" | "Battle" | "Result" | "End";

export type SceneProps = {
  key: Key;
  renderer: WebGLRenderer;
  size: Size;
};
export type Size = {
  width: number;
  height: number;
};
export abstract class Scene {
  protected key: Key;
  protected renderer: WebGLRenderer;
  protected size: Size;
  constructor({ key, renderer, size }: SceneProps) {
    this.key = key;
    this.renderer = renderer;
    this.size = size;
  }
}

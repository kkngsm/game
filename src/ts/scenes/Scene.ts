import { WebGLRenderer } from "three";
import { Key } from "../Key";

export type State = "Title" | "Battle" | "Result" | "End";

export type SceneProps = {
  key: Key;
  renderer: WebGLRenderer;
};
export abstract class Scene {
  protected key: Key;
  protected renderer: WebGLRenderer;
  constructor({ key, renderer }: SceneProps) {
    this.key = key;
    this.renderer = renderer;
  }
}

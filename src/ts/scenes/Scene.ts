import { Key } from "../Key";

export type State = "Title" | "Battle" | "Result" | "End";

export abstract class Scene {
  constructor(protected key: Key) {}
}

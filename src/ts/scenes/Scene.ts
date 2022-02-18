import { GameProps, RenderProps } from "../../types/type";

export type State = "Title" | "Battle" | "Result" | "End";

export abstract class Scene {
  constructor(protected gps: GameProps, protected rps: RenderProps) {}
}

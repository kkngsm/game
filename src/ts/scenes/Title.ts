import { Scene, SceneProps, State } from "./Scene";

export default class Title extends Scene {
  constructor(prop: SceneProps) {
    super(prop);
  }

  run(): State {
    console.log("Title");
    return "Battle" as State;
  }
}

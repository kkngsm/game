import { Scene, SceneProps, State } from "./Scene";

export default class Result extends Scene {
  constructor(prop: SceneProps) {
    super(prop);
  }

  run(): State {
    console.log("Result");
    return "End" as State;
  }
}

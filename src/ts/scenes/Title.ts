import { Key } from "../Key";
import { Scene, State } from "./Scene";

export default class Title extends Scene {
  constructor(key: Key) {
    super(key);
  }

  run(): State {
    console.log("Title");
    return "Battle" as State;
  }
}

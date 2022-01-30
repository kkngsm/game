import { Key } from "../Key";
import { Scene, State } from "./Scene";

export default class Result extends Scene {
  constructor(key: Key) {
    super(key);
  }

  run(): State {
    console.log("Result");
    return "End" as State;
  }
}

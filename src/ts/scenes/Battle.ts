import { Key } from "../Key";
import { Scene, State } from "./Scene";

export default class Battle extends Scene {
  constructor(key: Key) {
    super(key);
  }

  async run() {
    console.log("Battle");
    return new Promise<State>((resolve) => {
      const draw = (time: number) => {
        console.log("draw");
        if (this.key.key !== "Enter") {
          requestAnimationFrame(() => {
            draw(time);
          });
        } else {
          resolve("Result" as State);
        }
      };
      requestAnimationFrame((time) => {
        draw(time);
      });
    }).then(() => {
      return "Result" as State;
    });
  }
}

import { WebGLRenderer } from "three";
import "../sass/style.sass";
import { Key } from "./Key";
import Battle from "./scenes/Battle";
import Result from "./scenes/Result";
import { SceneProps, Size, State } from "./scenes/Scene";
import Title from "./scenes/Title";
class Game {
  async main() {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");

    const key = new Key();
    const renderer = new WebGLRenderer({ canvas });
    renderer.autoClear = true;
    renderer.setClearAlpha(0);
    const size: Size = {
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    };
    const props: SceneProps = {
      key,
      renderer,
      size,
    };
    const title = new Title(props);
    const battle = new Battle(props);
    const result = new Result(props);
    //状態遷移によるシーン管理
    let currentState: State = "Title";
    stateMachine: for (;;) {
      switch (currentState) {
        case "Title":
          currentState = title.run();
          break;
        case "Battle":
          currentState = await battle.run();
          break;
        case "Result":
          currentState = result.run();
          break;
        case "End":
          console.log(currentState);
          break stateMachine;
        default:
          throw new Error("State machine: unknown value error");
      }
    }
    console.log("end");
  }
}
window.addEventListener("load", () => {
  const game = new Game();
  game.main();
});

import { Vector2, WebGLRenderer } from "three";
import "../sass/style.sass";
import { Key } from "./Key";
import Battle from "./scenes/Battle";
import Result from "./scenes/Result";
import { SceneProps, State } from "./scenes/Scene";
import Title from "./scenes/Title";
class Game {
  async main() {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const key = new Key();

    const windowSize = new Vector2(canvas.clientWidth, canvas.clientHeight);

    const renderer = new WebGLRenderer();
    renderer.autoClear = true;
    // renderer.setClearAlpha(0);
    renderer.extensions.get("EXT_color_buffer_float");
    renderer.setSize(windowSize.x, windowSize.y);
    const windowDownnerLeft = new Vector2(
      -canvas.clientWidth / 2,
      -canvas.clientHeight / 2
    );
    const props: SceneProps = {
      ctx2D: canvas.getContext("2d") as CanvasRenderingContext2D,
      key,
      renderer,
      windowSize,
      windowDownnerLeft,
    };
    const title = new Title(props);
    const battle = await Battle.init(props);
    const result = new Result(props);
    //状態遷移によるシーン管理
    let currentState: State = "Title";
    stateMachine: for (;;) {
      switch (currentState) {
        case "Title":
          currentState = await title.run();
          break;
        case "Battle":
          currentState = await battle.run();
          break;
        case "Result":
          currentState = await result.run();
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

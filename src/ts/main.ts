import { Vector2, WebGLRenderer } from "three";
import "../sass/style.sass";
import { GameProps, RenderProps } from "../types/type";
import { Key } from "./Key";
import Battle from "./scenes/Battle";
import Result from "./scenes/Result";
import { State } from "./scenes/Scene";
import Title from "./scenes/Title";
const main = async () => {
  const canvas = <HTMLCanvasElement>document.getElementById("canvas");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const key = new Key();
  const windowSize = new Vector2(canvas.clientWidth, canvas.clientHeight);
  const renderer = new WebGLRenderer();
  renderer.autoClear = true;
  renderer.extensions.get("EXT_color_buffer_float");
  renderer.setSize(windowSize.x, windowSize.y);
  const sp: RenderProps = {
    ctx2D: canvas.getContext("2d") as CanvasRenderingContext2D,
    renderer,
  } as const;
  const gp: GameProps = {
    key,
    windowSize,
  } as const;
  const title = new Title(gp, sp);
  const battle = await Battle.init(gp, sp);
  const result = new Result(gp, sp);
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
};
window.addEventListener("load", main);

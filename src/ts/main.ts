import { WebGLRenderer } from "three";
import { Key } from "./Key";
import Battle from "./scenes/Battle";
import Result from "./scenes/Result";
import { SceneProps, State } from "./scenes/Scene";
import Title from "./scenes/Title";
window.addEventListener("load", main);
async function main() {
  const canvas = <HTMLCanvasElement>document.getElementById("canvas");

  const key = new Key();
  const renderer = new WebGLRenderer({ canvas });

  const props: SceneProps = {
    key,
    renderer,
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
    }
  }
  console.log("end");
}

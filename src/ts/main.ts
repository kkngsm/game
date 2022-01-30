import { Key } from "./Key";
import Battle from "./scenes/Battle";
import { State } from "./scenes/Scene";
import Title from "./scenes/Title";

window.addEventListener("load", main);
async function main() {
  const key = new Key();
  const title = new Title(key);
  const battle = new Battle(key);

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
        console.log(currentState);
        currentState = "End";
        break;
      case "End":
        console.log(currentState);
        break stateMachine;
    }
  }
  console.log("end");
}

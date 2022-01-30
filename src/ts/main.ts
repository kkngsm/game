window.addEventListener("load", main);

export type State = "Title" | "Battle" | "Result" | "End";

function main() {
  //状態遷移によるシーン管理

  let currentState: State = "Title";
  stateMachine: for (;;) {
    switch (currentState) {
      case "Title":
        console.log(currentState);
        currentState = "Battle";
        break;
      case "Battle":
        console.log(currentState);
        currentState = "Result";
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

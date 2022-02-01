export class Key {
  public enter: boolean;
  public space: boolean;
  public w: boolean;
  public a: boolean;
  public s: boolean;
  public d: boolean;
  constructor() {
    this.enter = false;
    this.space = false;
    this.w = false;
    this.a = false;
    this.s = false;
    this.d = false;
    document.addEventListener("keydown", (e) => {
      this.set(e.key, true);
    });
    document.addEventListener("keyup", (e) => {
      this.set(e.key, false);
    });
  }
  set(key: string, value: boolean) {
    switch (key) {
      case "Enter":
        this.enter = value;
        break;
      case " ":
        this.space = value;
        break;
      case "w":
        this.w = value;
        break;
      case "a":
        this.a = value;
        break;
      case "s":
        this.s = value;
        break;
      case "d":
        this.d = value;
        break;
      default:
        break;
    }
  }
}

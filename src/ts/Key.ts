export class Key {
  public key: string | null;
  constructor() {
    this.key = null;
    const that = this;
    document.addEventListener("keydown", function (e) {
      that.key = e.key;
    });
    document.addEventListener("keyup", function (e) {
      that.key = null;
    });
  }
}

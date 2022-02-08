import { Texture, WebGLRenderer } from "three";
import { Drawer } from "./Drawer";
import { Mover } from "./Mover";

export class BossTexture {
  private move: Mover;
  private moved: Texture;
  private draw: Drawer;
  drew: Texture;
  constructor() {
    this.move = new Mover();
    this.draw = new Drawer();
    this.moved = this.move.data[0].texture;
  }
  render(renderer: WebGLRenderer) {
    this.drew = this.draw.render(renderer, this.moved);
    this.moved = this.move.render(renderer, this.drew);
    return this.drew;
  }
}

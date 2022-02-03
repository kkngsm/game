import { BoxGeometry, MeshBasicMaterial } from "three";
import GameObject from "../Object";

export default class Enemy extends GameObject {
  constructor() {
    const box = new BoxGeometry(10, 10, 10);
    const mat = new MeshBasicMaterial({ color: 0xd52626 });
    super(box, mat);
  }
}

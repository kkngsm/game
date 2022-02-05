import { MeshBasicMaterial, SphereGeometry } from "three";
import GameObject from "../Object";

export default class Enemy extends GameObject {
  constructor() {
    const box = new SphereGeometry(5, 32, 16);
    const mat = new MeshBasicMaterial({ color: 0xd52626 });
    super(box, mat);
    this.mesh.position.set(10, 0, 0);
  }
}

import { IcosahedronGeometry, MeshBasicMaterial, Vector3 } from "three";
import GameObject from "../Object";

export default class Bullet extends GameObject {
  constructor(pos: Vector3) {
    const box = new IcosahedronGeometry(1, 0);
    const mat = new MeshBasicMaterial({ color: 0xa42d2d });
    super(box, mat);
    this.mesh.position.set(pos.x, pos.y, pos.z);
  }
  update() {
    this.mesh.position.x = this.mesh.position.x + 2;
  }
}

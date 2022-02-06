import { IcosahedronGeometry, Vector3 } from "three";
import createStanderdMaterial from "../../materials/StanderdMaterial";
import GameObject from "../GameObject";

export default class Bullet extends GameObject {
  size: number;
  constructor(pos: Vector3) {
    const size = 0.5;
    const box = new IcosahedronGeometry(size, 0);
    const mat = createStanderdMaterial(0xa42d2d);
    super(box, mat);
    this.size = size;
    this.mesh.position.set(pos.x, pos.y, pos.z);
  }
  update() {
    this.mesh.position.x = this.mesh.position.x + 2;
  }
}

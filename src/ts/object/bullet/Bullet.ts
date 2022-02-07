import { IcosahedronGeometry, Vector3 } from "three";
import config from "../../config";
import createStanderdMaterial from "../../materials/StanderdMaterial";
import GameObject from "../GameObject";

export default class Bullet extends GameObject {
  size: number;
  constructor(pos: Vector3) {
    const box = new IcosahedronGeometry(config.bullet.size, 0);
    const mat = createStanderdMaterial(0xa42d2d);
    super(box, mat);
    this.size = config.bullet.size;
    this.mesh.position.set(pos.x, pos.y, pos.z);
  }
  update(time: number) {
    this.mesh.position.x = this.mesh.position.x + 2;
  }
}

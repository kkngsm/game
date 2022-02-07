import { IcosahedronGeometry, Vector3 } from "three";
import config from "../../config";
import createStanderdMaterial from "../../materials/StanderdMaterial";
import GameObject from "../GameObject";

export default class Bullet extends GameObject {
  radius: number;
  constructor(pos: Vector3) {
    const box = new IcosahedronGeometry(config.bullet.radius, 0);
    const mat = createStanderdMaterial(0xa42d2d);
    super(box, mat);
    this.radius = config.bullet.radius;
    this.mesh.position.set(pos.x, pos.y, pos.z);
  }
  update(time: number) {
    this.mesh.position.x = this.mesh.position.x + 2;
  }
}

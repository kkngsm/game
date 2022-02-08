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
    this.model.position.set(pos.x, pos.y, pos.z);
  }
  update(time: number) {
    this.model.position.x = this.model.position.x + 2;
  }
}

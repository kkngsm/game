import { SphereGeometry } from "three";
import createStanderdMaterial from "../../materials/StanderdMaterial";
import GameObject from "../GameObject";

export default class Enemy extends GameObject {
  size: number;
  constructor() {
    const size = 5;
    const box = new SphereGeometry(size, 32, 16);
    const mat = createStanderdMaterial(0xd52626);
    super(box, mat);
    this.size = size;
    this.mesh.position.set(10, 0, 0);
  }
}

import { SphereGeometry } from "three";
import config from "../../config";
import createStanderdMaterial from "../../materials/StanderdMaterial";
import GameObject from "../GameObject";

export default class Enemy extends GameObject {
  radius: number;
  constructor() {
    const box = new SphereGeometry(config.enemy.radius, 32, 16);
    const mat = createStanderdMaterial(0xd52626);
    super(box, mat);
    this.radius = config.enemy.radius;
    this.mesh.position.set(20, 0, 0);
  }
  update(time: number) {
    this.mesh.position.set(20, Math.sin(time * 0.001) * 10, 0);
  }
}

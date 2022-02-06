import { BoxGeometry, Vector2 } from "three";
import { Key } from "../Key";
import config from "../config";
import GameObject from "./GameObject";
import createStanderdMaterial from "../materials/StanderdMaterial";
export default class Player extends GameObject {
  size: number;
  lastFiredTime: number;
  speed: Vector2;
  constructor() {
    const size = 10;
    const box = new BoxGeometry(size, 10, 10);
    const mat = createStanderdMaterial(0x1ec876);
    super(box, mat);
    this.size = size;
    this.speed = new Vector2(0, 0);
    this.lastFiredTime = -10;
  }
  operation(key: Key) {
    /*加速*/
    if (key.w) {
      this.speed.y += config.player.acceleration;
    }
    if (key.a) {
      this.speed.x -= config.player.acceleration;
    }
    if (key.s) {
      this.speed.y -= config.player.acceleration;
    }
    if (key.d) {
      this.speed.x += config.player.acceleration;
    }

    /*速度制限*/
    if (this.speed.x > config.player.maxSpeed) {
      this.speed.x = config.player.maxSpeed;
    } else if (this.speed.x < -config.player.maxSpeed) {
      this.speed.x = -config.player.maxSpeed;
    }
    if (this.speed.y > config.player.maxSpeed) {
      this.speed.y = config.player.maxSpeed;
    } else if (this.speed.y < -config.player.maxSpeed) {
      this.speed.y = -config.player.maxSpeed;
    }
  }
  update() {
    /*移動*/
    this.mesh.position.x += this.speed.x;
    this.mesh.position.y += this.speed.y;
    this.speed.multiplyScalar(0.9);
  }
}

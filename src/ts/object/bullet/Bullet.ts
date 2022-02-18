import { IcosahedronGeometry, Vector2, Vector3 } from "three";
import config from "../../config";
import createStanderdMaterial from "../../materials/StanderdMaterial";
import GameObject from "../GameObject";

export default class Bullet extends GameObject {
  radius: number;
  /**
   * @param halfPlayArea プレイエリアの大きさの半分
   * @param pos 位置
   */
  constructor(halfPlayArea: Vector2, pos: Vector3) {
    const box = new IcosahedronGeometry(config.bullet.radius, 0);
    const mat = createStanderdMaterial(0xa42d2d);
    super(halfPlayArea, box, mat);
    this.radius = config.bullet.radius;
    this.model.position.set(pos.x, pos.y, pos.z);
  }
  /**
   * 更新処理
   * @param elapsedTime 前フレームからの経過時間
   * @returns Bulletが存在するか、否か
   */
  update(elapsedTime: number): boolean {
    this.model.position.x = this.model.position.x + 2;
    return this.model.position.x > this.halfPlayArea.x;
  }
}

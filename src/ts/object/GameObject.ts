import { BufferGeometry, Group, Material, Mesh, Vector2, Vector3 } from "three";

export default abstract class GameObject {
  abstract radius: number;
  model: Mesh | Group;
  /**
   *
   * @param halfPlayArea プレイエリアの大きさの半分
   * @param geo 3Dモデル
   * @param mat マテリアル
   */
  constructor(
    protected halfPlayArea: Vector2,
    geo?: BufferGeometry,
    mat?: Material
  ) {
    if (geo !== undefined && mat !== undefined) {
      this.model = new Mesh(geo, mat);
    }
  }
  /**
   * 更新処理
   * @param elapsedTime 前フレームからの経過時間
   */
  abstract update(elapsedTime: number): boolean;
  /**
   * 場所
   */
  get pos(): Vector3 {
    return this.model.position;
  }
}

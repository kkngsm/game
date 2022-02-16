import { BufferGeometry, Group, Material, Mesh, Vector3 } from "three";
import { GameInfos } from "../../types/type";

export default abstract class GameObject {
  abstract radius: number;
  model: Mesh | Group;
  constructor(
    protected infos: GameInfos,
    geo?: BufferGeometry,
    mat?: Material
  ) {
    if (geo !== undefined) {
      this.model = new Mesh(geo, mat);
    }
  }
  abstract update(time: number): void;
  get pos(): Vector3 {
    return this.model.position;
  }
}

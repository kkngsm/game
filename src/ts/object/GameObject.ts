import { BufferGeometry, Group, Material, Mesh, Vector3 } from "three";

export default abstract class GameObject {
  abstract radius: number;
  model: Mesh | Group;
  constructor(geo?: BufferGeometry, mat?: Material) {
    if (geo !== undefined) {
      this.model = new Mesh(geo, mat);
    }
  }
  abstract update(time: number): void;
  get pos(): Vector3 {
    return this.model.position;
  }
}

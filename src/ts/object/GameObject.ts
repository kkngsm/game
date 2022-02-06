import { BufferGeometry, Material, Mesh, Vector3 } from "three";

export default abstract class GameObject {
  abstract size: number;
  mesh: Mesh;
  constructor(geo: BufferGeometry, mat: Material) {
    this.mesh = new Mesh(geo, mat);
  }
  get pos(): Vector3 {
    return this.mesh.position;
  }
}

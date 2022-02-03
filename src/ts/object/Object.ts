import { BufferGeometry, Material, Mesh } from "three";

export default class GameObject {
  mesh: Mesh;
  constructor(geo: BufferGeometry, mat: Material) {
    this.mesh = new Mesh(geo, mat);
  }
}

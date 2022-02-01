import { IcosahedronGeometry, Mesh, MeshBasicMaterial, Vector3 } from "three";

export default class Bullet {
  mesh: Mesh;
  constructor(pos: Vector3) {
    const box = new IcosahedronGeometry(1, 0);
    const mat = new MeshBasicMaterial({ color: 0xa42d2d });
    this.mesh = new Mesh(box, mat);
    this.mesh.position.set(pos.x, pos.y, pos.z);
  }
  update() {
    this.mesh.position.x = this.mesh.position.x + 2;
  }
}

import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { Key } from "./Key";

export default class Player {
  mesh: Mesh;
  constructor() {
    const box = new BoxGeometry(10, 10, 10);
    const mat = new MeshBasicMaterial({ color: 0x1ec876 });
    this.mesh = new Mesh(box, mat);
  }
  operation(key: Key) {
    if (key.w) {
      this.mesh.position.y = this.mesh.position.y + 0.5;
    }
    if (key.a) {
      this.mesh.position.x = this.mesh.position.x - 0.5;
    }
    if (key.s) {
      this.mesh.position.y = this.mesh.position.y - 0.5;
    }
    if (key.d) {
      this.mesh.position.x = this.mesh.position.x + 0.5;
    }
  }
  get pos(): Vector3 {
    return this.mesh.position;
  }
}

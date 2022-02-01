import Bullet from "./bullet/Bullet";
import Player from "./Player";
import { PerspectiveCamera, Scene as TScene, Vector3 } from "three";
import { Size } from "../scenes/Scene";
import { Key } from "../Key";
import config from "../config";
export default class Objects {
  readonly scene: TScene;
  readonly camera: PerspectiveCamera;
  private player: Player;
  private bullets: Bullet[];
  constructor(size: Size) {
    this.scene = new TScene();

    this.camera = new PerspectiveCamera(45, size.width / size.height, 1, 10000);
    this.camera.position.z = 100;
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.bullets = [];
    this.player = new Player();
    this.player.mesh.position.set(0, 0, 0);
    this.scene.add(this.player.mesh);
  }
  update() {
    this.bullets.forEach((e) => e.update());
  }
  operation(time: number, key: Key) {
    this.player.operation(key);
    if (key.space) {
      console.log(time - this.player.lastFiredTime);
      if (time - this.player.lastFiredTime > config.rate.bullet) {
        const bullet = new Bullet(this.player.pos);
        this.bullets.push(bullet);
        this.scene.add(bullet.mesh);
        this.player.lastFiredTime = time;
        if (this.bullets.length > 100) {
          this.scene.remove((<Bullet>this.bullets.shift()).mesh);
        }
      }
    }
  }
}

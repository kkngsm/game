import Bullet from "./bullet/Bullet";
import Player from "./Player";
import { PerspectiveCamera, Vector3 } from "three";
import { Size } from "../scenes/Scene";
import { Key } from "../Key";
import config from "../config";
import Enemy from "./enemy/Enemy";
import RenderPath from "../renderPath/RenderPath";

export default class MainPath extends RenderPath {
  private player: Player;
  private bullets: Bullet[];
  private enemy: Enemy;
  constructor(size: Size) {
    super(new PerspectiveCamera(45, size.width / size.height, 1, 10000));
    this.camera.position.z = 100;
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.bullets = [];
    this.player = new Player();
    this.player.mesh.position.set(0, 0, 0);

    this.enemy = new Enemy();

    this.scene.add(this.player.mesh, this.enemy.mesh);
  }
  update() {
    this.bullets.forEach((e) => e.update());
    this.player.update();
    const len = this.bullets.length;
    for (let i = 0; i < len; i = i + 1) {
      const distance = new Vector3()
        .copy(this.bullets[i].pos)
        .sub(this.enemy.pos)
        .length();
      if (distance < 5 || this.bullets[i].pos.x > 50) {
        this.scene.remove((this.bullets.splice(i, 1)[0] as Bullet).mesh);
        break;
      }
    }
  }
  operation(time: number, key: Key) {
    this.player.operation(key);
    if (key.space) {
      if (time - this.player.lastFiredTime > config.bullet.rate) {
        const bullet = new Bullet(this.player.pos);
        this.bullets.push(bullet);
        this.scene.add(bullet.mesh);
        this.player.lastFiredTime = time;
        if (this.bullets.length > 100) {
          this.scene.remove((this.bullets.shift() as Bullet).mesh);
        }
      }
    }
  }
}

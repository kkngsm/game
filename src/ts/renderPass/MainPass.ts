import Bullet from "../object/bullet/Bullet";
import Player from "../object/Player";
import { PerspectiveCamera, Vector2, Vector3 } from "three";
import { Key } from "../Key";
import config from "../config";
import Enemy from "../object/enemy/Enemy";
import RenderPass from "./RenderPass";

/**
 * メインの処理のクラス
 * 遅延なのでalbedo, normalを出力
 */
export default class MainPath extends RenderPass {
  private areaSize: Vector2;
  private areaDownnerLeft: Vector2;

  private player: Player;
  private bullets: Bullet[];
  private enemy: Enemy;
  /**
   * @param windowSize 画面サイズ
   */
  constructor(windowSize: Vector2) {
    const fov = 45;
    const cameraZ = 100;
    const aspect = windowSize.x / windowSize.y;
    super(new PerspectiveCamera(fov, aspect, 1, 10000));
    this.camera.position.z = cameraZ;
    this.camera.lookAt(new Vector3(0, 0, 0));

    const areaHeight = Math.tan((fov / 180) * 0.5 * Math.PI) * cameraZ * 2;
    this.areaSize = new Vector2(areaHeight * aspect, areaHeight);
    this.areaDownnerLeft = this.areaSize.clone().multiplyScalar(-0.5);

    this.bullets = [];
    this.player = new Player();
    this.player.mesh.position.set(0, 0, 0);

    this.enemy = new Enemy();

    this.scene.add(this.player.mesh, this.enemy.mesh);
  }
  /**
   * 更新処理をする
   * 接触、ダメージなど
   */
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
  /**
   * 操作による更新を行う
   * @param time レンダリング開始からの時間
   * @param key キー入力クラス
   */
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

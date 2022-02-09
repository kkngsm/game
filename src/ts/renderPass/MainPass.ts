import Bullet from "../object/bullet/Bullet";
import Player from "../object/Player";
import {
  PerspectiveCamera,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { Key } from "../Key";
import config from "../config";
import Enemy from "../object/Enemy/Enemy";
import RenderPass from "./RenderPass";
import { QTree } from "../QTree/QTree";
import { WebGLDefferdRenderTargets } from "../WebGLDefferdRenderTargets";
/**
 * メインの処理のクラス
 * 遅延なのでalbedo, normalを出力
 */
export default class MainPath extends RenderPass {
  private areaSize: Vector2;
  private areaDownnerLeft: Vector2;

  private player: Player;
  private bullets: QTree<Bullet>;
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
  }
  public static async init(windowSize: Vector2): Promise<MainPath> {
    const main = new MainPath(windowSize);
    await main.setObjects();
    return main;
  }
  /**
   * 更新処理をする
   * 接触、ダメージなど
   */
  update(time: number) {
    this.bullets = this.bullets.allUpdate((e) => {
      e.update(time);
      if (e.pos.x > 50) {
        this.scene.remove(e.model);
        return false;
      } else {
        return true;
      }
    });

    this.player.update();
    this.enemy.update(time);

    const contactDistance = config.bullet.radius + config.enemy.radius;
    this.bullets.cellUpdate(this.enemy, (e) => {
      const distance = new Vector3().copy(e.pos).sub(this.enemy.pos).length();
      if (distance < contactDistance) {
        this.scene.remove(e.model);
        return false;
      } else {
        return true;
      }
    });
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
        this.bullets.add(bullet);
        this.scene.add(bullet.model);
        this.player.lastFiredTime = time;
      }
    }
  }
  render(
    renderer: WebGLRenderer,
    renderTarget: WebGLRenderTarget | WebGLDefferdRenderTargets | null
  ): void {
    this.enemy.render(renderer);
    renderer.setRenderTarget(renderTarget);
    renderer.clear();
    renderer.render(this.scene, this.camera);
  }
  private async setObjects() {
    this.bullets = new QTree(this.areaDownnerLeft, this.areaSize);
    this.player = await Player.init();
    this.player.model.position.set(0, 0, 0);

    this.enemy = new Enemy();

    this.scene.add(this.player.model, this.enemy.model);
  }
}

import Bullet from "../object/bullet/Bullet";
import Player from "../object/Player";
import {
  LinearFilter,
  PerspectiveCamera,
  RGBAFormat,
  UnsignedByteType,
  Vector2,
  Vector3,
} from "three";
import config from "../config";
import Enemy from "../object/enemy/Enemy";
import RenderPass from "./RenderPass";
import { QTree } from "../QTree/QTree";
import { WebGLDefferdRenderTargets } from "../WebGLDefferdRenderTargets";
import { GameProps, MainInfos, RenderProps } from "../../types/type";

/**
 * メインの処理のクラス
 * 遅延レンダリングのためのalbedo, normalを出力
 */
export class MainPass extends RenderPass {
  readonly rawRender: WebGLDefferdRenderTargets;
  // HUDのための情報取得関数
  private infos: MainInfos;

  private player: Player;
  private bullets: QTree<Bullet>;
  private enemy: Enemy;
  private halfPlayAreaSize: Vector2;
  /**
   * (注)MainPassインスタンス生成にはMainPass.init()を用いる
   * @param gps ゲーム関連の定数
   * @param rps レンダリング関連の定数
   */
  constructor(private gps: GameProps, rps: RenderProps) {
    super(rps);
    this.rawRender = new WebGLDefferdRenderTargets(
      gps.windowSize.x,
      gps.windowSize.y,
      [
        {
          name: "albedo",
          minFilter: LinearFilter,
          magFilter: LinearFilter,
          type: UnsignedByteType,
          format: RGBAFormat,
        },
        {
          name: "normal",
          minFilter: LinearFilter,
          magFilter: LinearFilter,
          type: UnsignedByteType,
          format: RGBAFormat,
        },
      ]
    );
  }

  /**
   * 初期化関数
   * @param gps ゲーム関連の定数
   * @param rps レンダリング関連の定数
   * @returns MainPassインスタンス
   */
  public static async init(
    gps: GameProps,
    rps: RenderProps
  ): Promise<MainPass> {
    const main = new MainPass(gps, rps);
    await main.set();
    return main;
  }

  /**
   * 更新処理
   * @param  time 経過時間
   * @param  prevTime 前フレームの時間
   * @returns  次フレームも計算するか(true)、しないか(false)
   */
  update(time: number, prevTime: number): boolean {
    this.infos.time = time;
    const elapsedTime = time - prevTime;
    this.bullets = this.bullets.allUpdate((e) => {
      if (e.update(elapsedTime)) {
        this.scene.remove(e.model);
        return false;
      } else {
        return true;
      }
    });

    this.player.update(elapsedTime);
    this.enemy.update(elapsedTime);

    // enemyとの当たり判定
    const contactDistance = config.bullet.radius + config.enemy.radius;
    this.bullets = this.bullets.cellUpdate(this.enemy, (e) => {
      const distance = new Vector3().copy(e.pos).sub(this.enemy.pos).length();
      if (distance < contactDistance) {
        this.scene.remove(e.model);
        this.enemy.hp.damage(1);
        return false;
      } else {
        return true;
      }
    });
    return this.enemy.hp.isAlive();
  }
  /**
   * 操作による更新を行う
   * @param time レンダリング開始からの時間
   * @param key キー入力クラス
   */
  operation(time: number) {
    const { key } = this.gps;
    this.player.operation(key);
    if (key.space) {
      if (time - this.player.lastFiredTime > config.bullet.rate) {
        const bullet = new Bullet(this.halfPlayAreaSize, this.player.pos);
        this.bullets.add(bullet);
        this.scene.add(bullet.model);
        this.player.lastFiredTime = time;
      }
    }
  }
  /**
   * レンダリング
   */
  render(): void {
    const { renderer } = this.rps;
    this.enemy.render(renderer);
    renderer.setRenderTarget(this.rawRender);
    renderer.clear();
    renderer.render(this.scene, this.camera);
  }

  /**
   * HUDのための情報取得関数
   * @returns MainInfos
   */
  getInfos(): MainInfos {
    return this.infos;
  }
  /**
   * 初期設定をする。init関数で呼び出される。
   */
  private async set(): Promise<void> {
    const fov = 45;
    const cameraZ = 100;
    const aspect = this.gps.windowSize.x / this.gps.windowSize.y;
    this.camera = new PerspectiveCamera(fov, aspect, 1, 10000);
    this.camera.position.z = cameraZ;
    this.camera.lookAt(new Vector3(0, 0, 0));

    const areaHeight = Math.tan((fov / 180) * 0.5 * Math.PI) * cameraZ * 2;
    const areaSize = new Vector2(areaHeight * aspect, areaHeight);
    this.halfPlayAreaSize = areaSize.clone().multiplyScalar(0.5);
    this.bullets = new QTree<Bullet>(this.halfPlayAreaSize, areaSize);
    this.player = await Player.init(this.halfPlayAreaSize);
    this.player.model.position.set(0, 0, 0);

    this.enemy = await Enemy.init(this.halfPlayAreaSize);

    this.scene.add(this.player.model, this.enemy.model);
    this.infos = { enemyHP: this.enemy.hp, playerHP: this.player.hp, time: 0 };
  }
}

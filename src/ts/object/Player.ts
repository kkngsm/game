import {
  GLSL3,
  Group,
  Mesh,
  MeshBasicMaterial,
  RawShaderMaterial,
  Uniform,
  Vector2,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Key } from "../Key";
import config from "../config";
import GameObject from "./GameObject";
import vs from "../../glsl/standerd.vert";
import fs from "../../glsl/gltf.frag";
import playerModel from "../../assets/models/player.glb";
import { Hp } from "./hp";

export default class Player extends GameObject {
  hp: Hp;
  radius: number;
  lastFiredTime: number;
  speed: Vector2;
  /**
   * (注)Playerインスタンス生成にはPlayer.init()を用いる
   * @param halfPlayArea プレイエリアの大きさの半分
   */
  constructor(halfPlayArea: Vector2) {
    super(halfPlayArea);
  }

  /**
   * 初期化関数
   * @param halfPlayArea プレイエリアの大きさの半分
   * @returns Promise<Player>
   */
  public static async init(halfPlayArea: Vector2): Promise<Player> {
    const player = new Player(halfPlayArea);
    await player.set();
    return player;
  }
  /**
   * 操作による更新を行う
   * @param key 入力
   */
  operation(key: Key): void {
    /*加速*/
    if (key.w) {
      this.speed.y += config.player.acceleration;
    }
    if (key.a) {
      this.speed.x -= config.player.acceleration;
    }
    if (key.s) {
      this.speed.y -= config.player.acceleration;
    }
    if (key.d) {
      this.speed.x += config.player.acceleration;
    }

    /*速度制限*/
    if (this.speed.x > config.player.maxSpeed) {
      this.speed.x = config.player.maxSpeed;
    } else if (this.speed.x < -config.player.maxSpeed) {
      this.speed.x = -config.player.maxSpeed;
    }
    if (this.speed.y > config.player.maxSpeed) {
      this.speed.y = config.player.maxSpeed;
    } else if (this.speed.y < -config.player.maxSpeed) {
      this.speed.y = -config.player.maxSpeed;
    }
  }
  /**
   * 更新処理
   * @param elapsedTime 前フレームからの経過時間
   * @returns Playerが生きているか、否か
   */
  update(elapsedTime: number): boolean {
    /*移動*/
    const x = this.model.position.x + this.speed.x;
    if (-this.halfPlayArea.x < x && x < this.halfPlayArea.x / 2) {
      this.model.position.setX(x);
    }
    const y = this.model.position.y + this.speed.y;
    if (-this.halfPlayArea.y < y && y < this.halfPlayArea.y * 0.75) {
      this.model.position.setY(y);
    }
    this.speed.multiplyScalar(0.9);
    return true;
  }
  /**
   * 初期設定をする。init関数で呼び出される。
   */
  private async set() {
    this.hp = new Hp(10);
    this.radius = config.player.radius;
    this.speed = new Vector2(0, 0);
    this.lastFiredTime = -10;
    const loader = new GLTFLoader();
    const model = await (() => {
      return new Promise<Group>((resolve) => {
        loader.load(
          playerModel,
          (gltf) => {
            resolve(gltf.scene);
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          (err) => {
            console.error("Player gltf Model loading Error:", err);
          }
        );
      });
    })();
    model.traverse((object) => {
      if ((object as Mesh).isMesh) {
        const tex = ((object as Mesh).material as MeshBasicMaterial).map;
        (object as Mesh).material = new RawShaderMaterial({
          uniforms: { tex: new Uniform(tex) },
          vertexShader: vs,
          fragmentShader: fs,
          glslVersion: GLSL3,
        });
      }
    });
    this.model = model;
  }
}

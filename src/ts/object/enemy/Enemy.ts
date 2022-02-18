import {
  GLSL3,
  Group,
  Mesh,
  RawShaderMaterial,
  Texture,
  Vector2,
  WebGLRenderer,
} from "three";
import config from "../../config";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BossTexture } from "../../renderPass/bossTexture/BossTexture";
import GameObject from "../GameObject";
import vs from "../../../glsl/standerd.vert";
import fs from "../../../glsl/gltf.frag";
import bossModel from "../../../assets/models/boss.glb";
import createStanderdMaterial from "../../materials/StanderdMaterial";
import { Hp } from "../hp";

export default class Enemy extends GameObject {
  hp: Hp;
  radius: number;
  texture: BossTexture;
  uniforms: { tex: { type: "t"; value: undefined | Texture } };
  constructor(halfPlayArea: Vector2) {
    super(halfPlayArea);
    this.hp = new Hp(config.enemy.hp);
    this.texture = new BossTexture();
    this.uniforms = { tex: { type: "t", value: undefined } };
    this.radius = config.enemy.radius;
  }
  /**
   * (注)MainPassインスタンス生成にはMainPass.init()を用いる
   * @param halfPlayArea プレイエリアの大きさの半分
   * @returns Promise<Player>
   */
  public static async init(halfPlayArea: Vector2) {
    const enemy = new Enemy(halfPlayArea);
    await enemy.set();
    return enemy;
  }
  /**
   * 更新処理
   * @param elapsedTime 前フレームからの経過時間
   * @returns Enemyが生きているか、否か
   */
  update(elapsedTime: number): boolean {
    return true;
  }
  /**
   * テクスチャの描画
   * @param renderer WebGLRenderer
   */
  render(renderer: WebGLRenderer) {
    this.uniforms.tex.value = this.texture.render(renderer);
  }
  /**
   * 初期設定をする。init関数で呼び出される。
   */
  private async set() {
    const loader = new GLTFLoader();
    const model = await (() => {
      return new Promise<Group>((resolve) => {
        loader.load(
          bossModel,
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
    if ((model.children[0] as Mesh).isMesh) {
      (model.children[0] as Mesh).material = createStanderdMaterial(0xffffff);
    }
    if ((model.children[1] as Mesh).isMesh) {
      (model.children[1] as Mesh).material = new RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vs,
        fragmentShader: fs,
        glslVersion: GLSL3,
      });
    }
    this.model = model;
    this.model.position.set(20, 0, 0);
    this.model.scale.set(3, 3, 3);
    this.model.rotateY(-0.9);
  }
}

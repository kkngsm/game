import {
  GLSL3,
  Group,
  Mesh,
  RawShaderMaterial,
  Uniform,
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

export default class Enemy extends GameObject {
  radius: number;
  texture: BossTexture;
  uniforms: any;
  constructor() {
    super();
    this.texture = new BossTexture();
    this.uniforms = { tex: { type: "t", value: undefined } };
    this.radius = config.enemy.radius;
  }
  public static async init() {
    const enemy = new Enemy();
    await enemy.set();
    return enemy;
  }
  update(time: number) {
    this.model.position.set(20, Math.sin(time * 0.001) * 10, 0);
  }
  render(renderer: WebGLRenderer) {
    this.uniforms.tex.value = this.texture.render(renderer);
  }
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

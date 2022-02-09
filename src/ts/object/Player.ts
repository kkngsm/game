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
export default class Player extends GameObject {
  radius: number;
  lastFiredTime: number;
  speed: Vector2;
  constructor() {
    super();
    this.radius = config.player.radius;
    this.speed = new Vector2(0, 0);
    this.lastFiredTime = -10;
  }
  public static async init(): Promise<Player> {
    const player = new Player();
    await player.set();
    return player;
  }
  operation(key: Key) {
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
  update() {
    /*移動*/
    this.model.position.x += this.speed.x;
    this.model.position.y += this.speed.y;
    this.speed.multiplyScalar(0.9);
  }
  private async set() {
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

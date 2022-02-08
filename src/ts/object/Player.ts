import { BoxGeometry, Group, Vector2 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Key } from "../Key";
import config from "../config";
import GameObject from "./GameObject";
import createStanderdMaterial from "../materials/StanderdMaterial";
export default class Player extends GameObject {
  radius: number;
  lastFiredTime: number;
  speed: Vector2;
  constructor(model: Group) {
    super();
    this.mesh = model;
    this.radius = config.player.radius;
    this.speed = new Vector2(0, 0);
    this.lastFiredTime = -10;
  }
  public static async init(): Promise<Player> {
    const loader = new GLTFLoader();
    const url = "../../assets/player.glb";
    const model = await (() => {
      return new Promise<Group>((resolve) => {
        loader.load(
          url,
          (gltf) => {
            resolve(gltf.scene);
          },
          (err) => {
            console.error(err);
          }
        );
      });
    })();
    return new Player(model);
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
    this.mesh.position.x += this.speed.x;
    this.mesh.position.y += this.speed.y;
    this.speed.multiplyScalar(0.9);
  }
}

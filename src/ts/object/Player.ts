import { BoxGeometry, Group, Mesh, Vector2 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Key } from "../Key";
import config from "../config";
import GameObject from "./GameObject";
import createStanderdMaterial from "../materials/StanderdMaterial";
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
    const loader = new GLTFLoader();
    const model = await (() => {
      return new Promise<Group>((resolve) => {
        loader.load(
          playerModel,
          (gltf) => {
            resolve(gltf.scene);
          },
          (err) => {
            console.error(err);
          }
        );
      });
    })();
    const player = new Player();
    player.set(model);
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
  private set(model: Group) {
    model.traverse((object) => {
      if ((object as Mesh).isMesh) {
        (object as Mesh).material = createStanderdMaterial(0xffffff);
      }
    });
    this.model = model;
  }
}

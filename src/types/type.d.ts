import { Vector2, WebGLRenderer } from "three";
import { Key } from "../ts/Key";
import { Hp } from "../ts/object/hp";

export type GameProps = {
  windowSize: Vector2;
  key: Key;
};
export type RenderProps = {
  ctx2D: CanvasRenderingContext2D;
  renderer: WebGLRenderer;
};

export type MainInfos = {
  enemyHP: Hp;
  playerHP: Hp;
  time: number;
};

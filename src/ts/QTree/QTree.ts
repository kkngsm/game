import { Vector2 } from "three";
import config from "../config";
import GameObject from "../object/GameObject";
export class QTree<T extends GameObject> {
  maxLevel: number;
  readonly cells: Cell<T>[];
  constructor(private width: number, private height: number) {
    /**線形四分木に必要な要素数 */
    const len = (4 ** config.QTree.maxLevel - 1) / 3;
    this.cells = new Array<Cell<T>>(len);
    for (let i = 0; i < len; i++) {
      this.cells[i] = new Cell<T>(i);
    }
  }
  add(a: T) {
    const pos = new Vector2(a.pos.x, a.pos.y);
    const downnerLeft = new Vector2().copy(pos).subScalar(a.size / 2);
    const upperRight = new Vector2().copy(pos).addScalar(a.size / 2);
    return this.getMortonCodefromRect(downnerLeft, upperRight);
  }
  /**
   * 点の位置するモートン符号を取得
   * @param point 位置
   * @returns モートン符号
   */
  getMortonCodefromPoint(point: Vector2): number {
    return this.index2MortonCode(this.getIndex(point));
  }
  /**
   * 四角形の位置するモートン符号を取得
   * @param a 隅の位置ベクトル
   * @param b 隅の位置ベクトル
   * @returns モートン符号
   */
  getMortonCodefromRect(a: Vector2, b: Vector2): number {
    const ma = this.getIndex(a);
    const mb = this.getIndex(b);
    if (ma === mb) {
      return this.index2MortonCode(ma);
    } else {
      let k;
      const c = ma ^ mb;
      for (let i = config.QTree.maxLevel - 1; i >= 0; i--) {
        if ((c & (0b11 << i)) !== 0) {
          k = i + 1;
          break;
        }
      }
      if (k == undefined) {
        throw new Error("k in undefined");
      }
      const level = config.QTree.maxLevel - k;
      const index = mb >> (2 * k);
      return this.index2MortonCode(index, level);
    }
  }
  /**
   * pointがその階層の何番目のセルにあるかを取得
   * @param point 位置
   * @returns 番号
   */
  private getIndex(point: Vector2): number {
    const xi: number = Math.floor(
      (point.x * 2 * config.QTree.maxLevel) / this.width
    );
    const yi: number = Math.floor(
      (point.y * 2 * config.QTree.maxLevel) / this.height
    );
    return (
      shiftTwice(xi, config.QTree.maxLevel) |
      (shiftTwice(yi, config.QTree.maxLevel) << 1)
    );
  }
  /**
   * lebelの階層におけるindex番目のセルをモートン符号に変換
   * @param index セルの番号
   * @param level 階層
   * @returns
   */
  private index2MortonCode(
    index: number,
    level: number = config.QTree.maxLevel
  ) {
    return (4 ** level - 1) / 3 + index;
  }
}

class Cell<T extends GameObject> {
  private objects: T[];
  constructor(private mortonCode: number) {}
  getParentMortonCode(): number[] {
    const result: number[] = [];
    let index = this.mortonCode;
    const l = this.getLevel();
    for (let i = 0; i < l; i++) {
      index = Math.floor((index - 1) / 4);
      result.push(index);
    }
    return result;
  }
  getChildrenMortonCode(): number[] {
    const result: number[] = [];
    let indexes = [this.mortonCode];
    for (let i = this.getLevel(); i < config.QTree.maxLevel; i++) {
      indexes = indexes
        .map((index: number) => {
          const childrenIndexes = [
            index * 4 + 1,
            index * 4 + 2,
            index * 4 + 3,
            index * 4 + 4,
          ];
          result.push(...childrenIndexes);
          return childrenIndexes;
        })
        .flat();
    }
    return result;
  }
  private getLevel(): number {
    return Math.floor(Math.log2(3 * this.mortonCode + 1) / 2);
  }
  output() {
    const result: [number | string] = [this.mortonCode];
    for (let i = config.QTree.maxLevel - 1; i >= 0; i--) {
      result.push(
        `level ${config.QTree.maxLevel - i}:`,
        (this.mortonCode >> (i * 2)) & 0b11
      );
    }
    console.log(...result);
  }
}

function shiftTwice(x: number, size: number) {
  let x_result = 0;
  for (let i = 0; i < size; i++) {
    x_result = x_result | (((1 << i) & x) << i);
  }
  return x_result;
}

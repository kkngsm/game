import { Vector2 } from "three";
import config from "../config";
import GameObject from "../object/GameObject";
export class QTree<T extends GameObject> {
  maxLevel: number;
  readonly cells: Cell<T>[];

  constructor(private downnerLeft: Vector2, private areaSize: Vector2) {
    /**線形四分木に必要な要素数 */
    const len = (4 ** (config.QTree.maxLevel + 1) - 1) / 3;
    this.cells = new Array<Cell<T>>(len);
    for (let i = 0; i < len; i++) {
      this.cells[i] = new Cell<T>(i);
    }
  }
  /**
   * すべての要素の更新(非破壊)
   * @param callback 更新処理
   * @returns 更新した新しいQTree
   */
  allUpdate(callback: (element: T) => boolean): QTree<T> {
    const temp = new QTree<T>(this.downnerLeft, this.areaSize);
    const cellslen = this.cells.length;
    for (let mc = 0; mc < cellslen; mc++) {
      const objects = this.cells[mc].objects;
      const oblen = objects.length;
      for (let i = 0; i < oblen; i++) {
        const alive = callback(objects[i]);
        if (alive) {
          temp.add(objects[i]);
        }
      }
    }
    return temp;
  }
  /**
   * aと重なっているセルの更新(非破壊)
   * @param a オブジェクト
   * @param callback 更新処理
   * @returns 更新した新しいQTree
   */
  cellUpdate<U extends GameObject>(
    a: U,
    callback: (element: T) => boolean
  ): QTree<T> {
    const temp = new QTree<T>(this.downnerLeft, this.areaSize);
    const ChildrenCellsMortonCodes = this.getOverlappingCellsMortonCodes(a);
    ChildrenCellsMortonCodes.forEach((e) => {
      const objects = this.cells[e].objects;
      const len = objects.length;
      for (let i = 0; i < len; i = i + 1) {
        const alive = callback(objects[i]);
        if (alive) {
          temp.add(objects[i]);
        }
      }
    });
    return temp;
  }
  /**
   * aをQTreeに追加
   * @param a 追加するオブジェクト
   * @returns 何番目に追加されたか
   */
  add(a: T) {
    return this.cells[this.getMortonCodeFromObject(a)].add(a);
  }
  /**
   * mortonCodeのセルのindex番目のオブジェクトを削除
   * @param mortonCode
   * @param index
   * @returns
   */
  remove(mortonCode: number, index: number) {
    return this.cells[mortonCode].remove(index);
  }
  /**
   * mortonCodeのセルのindex番目のオブジェクトを再設定する
   * @param mortonCode
   * @param index
   * @returns
   */
  reset(mortonCode: number, index: number) {
    this.add(this.remove(mortonCode, index));
  }
  /**
   * aに重なっているセルのモートン符号を取得
   * @param a
   * @returns セルのモートン符号の配列
   */
  private getOverlappingCellsMortonCodes<U extends GameObject>(a: U): number[] {
    const aMc = this.getMortonCodeFromObject(a);
    return [
      aMc,
      ...this.cells[aMc].getParentsMortonCodes(),
      ...this.cells[aMc].getChildrenMortonCodes(),
    ];
  }
  /**
   * オブジェクトからモートンコードを取得
   * @param a
   * @returns
   */
  private getMortonCodeFromObject<U extends GameObject>(a: U) {
    const pos = new Vector2(a.pos.x, a.pos.y);
    const downnerLeft = new Vector2().copy(pos).subScalar(a.radius);
    const upperRight = new Vector2().copy(pos).addScalar(a.radius);
    return this.getMortonCodefromRect(downnerLeft, upperRight);
  }
  /**
   * 点の位置するモートン符号を取得
   * @param point 位置
   * @returns モートン符号
   */
  private getMortonCodefromPoint(point: Vector2): number {
    return this.index2MortonCode(this.getIndex(point));
  }
  /**
   * 四角形の位置するモートン符号を取得
   * @param a 隅の位置ベクトル
   * @param b 隅の位置ベクトル
   * @returns モートン符号
   */
  private getMortonCodefromRect(a: Vector2, b: Vector2): number {
    const ma = this.getIndex(a);
    const mb = this.getIndex(b);
    if (ma === mb) {
      return this.index2MortonCode(ma);
    } else {
      let k;
      const c = ma ^ mb;
      for (let i = config.QTree.maxLevel - 1; i >= 0; i--) {
        if ((c & (0b11 << (i * 2))) >> (i * 2) !== 0) {
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
    const p = new Vector2()
      .subVectors(point, this.downnerLeft)
      .multiplyScalar(2 * config.QTree.maxLevel)
      .divide(this.areaSize);
    const xi: number = Math.floor(p.x);
    const yi: number = Math.floor(p.y);
    const ans =
      shiftTwice(xi, config.QTree.maxLevel) |
      (shiftTwice(yi, config.QTree.maxLevel) << 1);
    return ans;
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
  objects: T[];
  constructor(private mortonCode: number) {
    this.objects = [];
  }
  /**
   * Cellにオブジェクトaを追加
   * @param a
   * @returns 何番目に追加されたか
   */
  add(a: T): number {
    return this.objects.push(a);
  }
  /**
   * Cellからindex番目の要素を削除
   * @param index
   * @returns 消された要素
   */
  remove(index: number): T {
    if (index < 0 || this.objects.length <= index) {
      throw new Error(
        `Cell.remove(): index = ${index} exceeds the length of the array`
      );
    }
    return this.objects.splice(index, 1)[0];
  }
  /**
   * すべての親のモートン符号を取得
   * @returns モートン符号の配列
   */
  getParentsMortonCodes(): number[] {
    const result: number[] = [];
    let index = this.mortonCode;
    const l = this.getLevel();
    for (let i = 0; i < l; i++) {
      index = Math.floor((index - 1) / 4);
      result.push(index);
    }
    return result;
  }
  /**
   * すべての子のモートン符号を取得
   * @returns モートン符号の配列
   */
  getChildrenMortonCodes(): number[] {
    const result: number[] = [];
    let indices = [this.mortonCode];
    for (let i = this.getLevel(); i < config.QTree.maxLevel; i++) {
      indices = indices
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
  /**
   * 何階層目のセルか取得
   * @returns 何階層目か
   */
  private getLevel(): number {
    return Math.floor(Math.log2(3 * this.mortonCode + 1) / 2);
  }
}

function shiftTwice(x: number, size: number) {
  let x_result = 0;
  for (let i = 0; i < size; i++) {
    x_result = x_result | (((1 << i) & x) << i);
  }
  return x_result;
}

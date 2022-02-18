export class Hp {
  maxHp;
  hp: number;
  constructor(maxHP: number) {
    this.maxHp = maxHP;
    this.hp = maxHP;
  }
  damage(d: number) {
    this.hp -= d;
  }
  isAlive(): boolean {
    return this.hp > 0;
  }
}

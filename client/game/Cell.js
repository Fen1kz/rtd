import * as PIXI from 'pixi.js';

export const CELL_SIZE = 20;

export default class Cell {
  constructor(x, y) {
    this.gfx = new PIXI.Sprite();

    this.x = x;
    this.y = y;
    this.gfx.x = x * CELL_SIZE + CELL_SIZE / 2;
    this.gfx.y = y * CELL_SIZE + CELL_SIZE / 2;
    this.near4 = [];
    this.near8 = [];
  }

  render() {
    this.gfx.removeChildren();
    const texture = new PIXI.Graphics();

    if (this.exit) {
      const dx = this.exit.x - this.x;
      const dy = this.exit.y - this.y;
      const arrow = new PIXI.Graphics();
      arrow.beginFill(0x0);
      arrow.drawRect(
         - CELL_SIZE / 8,  - CELL_SIZE / 8
        , CELL_SIZE / 4, CELL_SIZE / 4
      );
      arrow.endFill();
      arrow.lineStyle(1);
      arrow.moveTo(0, 0);
      arrow.lineTo(dx * CELL_SIZE / 2, dy * CELL_SIZE/ 2);
      this.gfx.addChild(arrow);
    }


    texture.lineStyle(1, 0x00FF00, .33);
    if (this.base) {
      texture.beginFill(0xFF0000, .5);
    } else if (this.wall) {
      texture.beginFill(0x0, .5);
    }
    texture.drawRect(-CELL_SIZE / 2, -CELL_SIZE / 2, CELL_SIZE, CELL_SIZE);
    texture.endFill();
    this.gfx.addChild(texture);
    // const text = new PIXI.Text(this.distance,{fontSize: 12});
    // this.gfx.addChild(text)
  }

  toString() {
    return `Cell(${this.x},${this.y})`
  }
}
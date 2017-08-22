import * as PIXI from 'pixi.js';

export const CELL_SIZE = 20;

export default class Cell {
  constructor(x, y) {
    this.gfx = new PIXI.Sprite();

    this.x = x;
    this.y = y;
    this.gfx.x = x * CELL_SIZE;
    this.gfx.y = y * CELL_SIZE;
  }

  getNear() {
    return [this.N, this.NE, this.E, this.SE, this.S, this.SW, this.W, this.NW].filter(c => !!c);
  }

  render() {
    this.gfx.removeChildren();
    const texture = new PIXI.Graphics();

    const arrowPolygon = new PIXI.Polygon([
      .2, .1
      , .7, .6
      , .8, .2
      , .9, .9
      , .2, .8
      , .6, .7
      , .1, .2
    ].map(x => x * CELL_SIZE * 1));

    if (this.exit) {
      const dx = this.x - this.exit.x;
      const dy = this.y - this.exit.y;
      const arrow = new PIXI.Graphics();
      arrow.beginFill(0x0, .3);
      arrow.drawShape(arrowPolygon);
      arrow.endFill();
      arrow.position.set(.5 * CELL_SIZE, .5 * CELL_SIZE);
      arrow.pivot.set(.5 * CELL_SIZE, .5 * CELL_SIZE);
      let angle = 0;

      if (dx == -1 && dy == -1) {
        angle = 0;
      } else if (dx == 0 && dy == -1) {
        angle = 45;
      } else if (dx == 1 && dy == -1) {
        angle = 90;
      } else if (dx == 1 && dy == 0) {
        angle = 135;
      } else if (dx == 1 && dy == 1) {
        angle = 180;
      } else if (dx == 0 && dy == 1) {
        angle = 225;
      } else if (dx == -1 && dy == 1) {
        angle = 270;
      } else if (dx == -1 && dy == 0) {
        angle = 315;
      }

      arrow.rotation = angle / 180 * Math.PI;
      this.gfx.addChild(arrow);
    }
    texture.lineStyle(1, 0x00FF00, .33);
    if (this.base) {
      texture.beginFill(0xFF0000, .5);
    } else if (this.wall) {
      texture.beginFill(0x0, .5);
    }
    texture.drawRect(0, 0, CELL_SIZE, CELL_SIZE);
    texture.endFill();
    this.gfx.addChild(texture);
  }
}
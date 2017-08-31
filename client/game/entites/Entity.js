import {Graphics} from 'pixi.js';
import Point from '../geom/Point';
import {CELL_SIZE} from '../Cell';

export default class Entity {
  loc = new Point();
  gfx = new Graphics();

  constructor() {
  }

  setXY(x, y) {
    this.loc.set(x, y);
    this.gfx.x = x * CELL_SIZE;
    this.gfx.y = y * CELL_SIZE;
    return this;
  }

  setLoc(p) {
    this.setXY(p.x, p.y);
    return this;
  }

  update() {

  }

  render() {

  }
}
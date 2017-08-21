import {Graphics} from 'pixi.js';
import Point from '../geom/Point';

export default class Entity {
  loc = new Point();
  gfx = new Graphics();

  constructor() {
    this.gfx.beginFill(0xFF0000);
    this.gfx.drawCircle(0, 0, 10);
  }

  setXY(x, y) {
    this.loc.set(x, y);
    this.gfx.x = x;
    this.gfx.y = y;
    return this;
  }

  setLoc(p) {
    this.setXY(p.x, p.y);
    return this;
  }

  update() {

  }
}
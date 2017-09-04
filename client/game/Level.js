import * as PIXI from 'pixi.js';

import Base from './entites/Base';
import {Orders} from './entites/Unit';
import Creep from './entites/Creep';

import Point from './geom/Point';
import Polygon from './geom/Polygon';

export default class Level {
  gfx = new PIXI.Container();
  entites = [];
  walls = [];
  wallsGfx = new PIXI.Graphics();

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.gfx.addChild(this.wallsGfx);
  }

  start() {
    this.base = new Base();
    this.base.position.set(600, 350);
    this.addEntity(this.base);

    this.walls.push(Polygon.fromArray([100, 100, 200, 100, 200, 200, 100, 200]));
    this.walls.push(Polygon.fromArray([100, 300, 100, 400, 200, 400, 200, 300]));
    this.walls.push(Polygon.fromArray([250, 150, 400, 50, 350, 150, 500, 300, 300, 300]));

    this.extWalls = this.walls.map(p => p.extrude(10));

    this.render();
  }

  addEntity(entity) {
    this.entites.push(entity);
    this.gfx.addChild(entity);
    return this;
  }

  spawn() {
    const creep = new Creep();
    creep.addOrder(Orders.FOLLOW(this.base));
    this.addEntity(creep);
  }

  update(game) {
  }

  render() {
    this.wallsGfx.clear();
    this.wallsGfx.lineStyle(1);
    this.walls.forEach(wall => {
      this.wallsGfx.drawPolygon(wall.toArray());
    });
    this.wallsGfx.lineStyle(1, 0x0000FF);
    this.extWalls.forEach(wall => {
      this.wallsGfx.drawPolygon(wall.toArray());
    });
    this.entites.forEach(e => e.render());
  }
}
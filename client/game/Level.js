import * as PIXI from 'pixi.js';

import Base from './entites/Base';
import {Orders} from './entites/Unit';
import Creep from './entites/Creep';

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

    this.walls.push(new PIXI.Polygon(100,100, 200,100, 200,200, 100,200, 100,100));
    this.walls.push(new PIXI.Polygon(250,150, 400,50, 350,150, 500,300, 300,300, 250,150));

    

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
    this.wallsGfx.lineStyle(5);
    this.walls.forEach(wall => {
      this.wallsGfx.drawPolygon(wall);
    });
    this.entites.forEach(e => e.render());
  }
}
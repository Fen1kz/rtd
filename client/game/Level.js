import * as PIXI from 'pixi.js';

import Base from './entites/Base';
import Entity from './entites/Base';
import {Orders} from './entites/Unit';
import Creep from './entites/Creep';

import Polygon from './geom/Polygon';
import Grid from './geom/Grid';
import GridManager from './managers/GridManager';

const DRAW_POLYGON_CIRCLE = 5;

export default class Level {
  gfx = new PIXI.Container();
  spawns = [];

  entites = [];
  polywalls = [];
  wallsGfx = new PIXI.Graphics();
  gridGfx = new PIXI.Graphics();
  stateGfx = new PIXI.Graphics();

  constructor(game, width, height) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.gfx.addChild(this.gridGfx);
    this.gfx.addChild(this.wallsGfx);
    this.gfx.addChild(this.stateGfx);

    this.stateGfx.beginFill(0);
    this.stateGfx.drawCircle(0, 0, 20);

    this.state = {};
  }

  start() {
    this.base = this.addEntity(Base);
    this.base.loc.set(600, 350);

    this.polywalls.push(new Polygon([100, 100, 200, 100, 200, 200, 100, 200]));
    this.polywalls.push(new Polygon([100, 300, 100, 400, 200, 400, 200, 300]));
    this.polywalls.push(new Polygon([250, 150, 450, 100, 350, 200, 450, 300, 300, 300]));

    this.pixiwalls = this.polywalls.map(p => p.toPIXI());

    this.gridManager = new GridManager(this.width, this.height);
    this.recalculate();
    // this.grid = new Grid(800, 600);

    Array(1).fill().forEach((u, i) => this.spawn(i));

    // this.recalculate();
    this.render();
  }

  recalculate() {
    this.gridManager.recalculate((x, y, v) => {
      for (let i = 0; i < this.pixiwalls.length; ++i) {
        if (this.pixiwalls[i].contains(x, y)) {
          return 1023;
        }
      }
      return 1;
    });
  }

  addEntity(entityClass) {
    const entity = new (entityClass)(this.game);
    this.entites.push(entity);
    this.gfx.addChild(entity.gfx);
    entity.render();
    return entity;
  }

  addWall(points) {
    this.polywalls.push(new Polygon(points));
    this.pixiwalls = this.polywalls.map(p => p.toPIXI());
    this.recalculate();
    this.render();
  }

  spawn(i) {
    const creep = this.addEntity(Creep);
    creep.id = i;
    creep.loc.set(40, 40);
    creep.addOrder(Orders.FOLLOW(this.base));
  }

  update() {
    this.entites.forEach(e => e.update());
  }

  getEntitiesNear(point, radius, filter = () => 1) {
    return this.entites.filter(e => filter(e) && point.dist2(e.loc) < Math.pow(radius + e.radius, 2));
  }

  render() {
    this.wallsGfx.clear();
    this.wallsGfx.lineStyle(1, 0x0, 0.1);
    this.pixiwalls.forEach(wall => {
      this.wallsGfx.drawPolygon(wall);
    });
    this.wallsGfx.lineStyle(1);
    if (this.state.polygon) {
      const polygon = new Polygon(this.state.polygon);
      this.wallsGfx.drawPolygon(polygon.toPIXI());
      polygon.forEachPoint((x, y, i) => {
        console.log(i, x, y);
        if (i === 0) this.wallsGfx.beginFill(0xFF0000);
        else this.wallsGfx.beginFill(0xFFFFFF);
        this.wallsGfx.drawCircle(x, y, DRAW_POLYGON_CIRCLE);
      });
      this.wallsGfx.endFill();
    }

    this.gridManager.render(this.gridGfx);
    this.entites.forEach(e => e.render());
  }
}
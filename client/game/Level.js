import * as PIXI from 'pixi.js';

import Base from './entites/Base';
import Entity from './entites/Base';
import {Orders} from './entites/Unit';
import Creep from './entites/Creep';

import Polygon from './geom/Polygon';
import Grid from './geom/Grid';

const DRAW_POLYGON_CIRCLE = 5;

export default class Level {
  gfx = new PIXI.Container();
  spawns = [];

  entites = [];
  polywalls = [];
  wallsGfx = new PIXI.Graphics();
  gridGfx = new PIXI.Graphics();

  constructor(game, width, height) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.gfx.addChild(this.gridGfx);
    this.gfx.addChild(this.wallsGfx);

    this.state = {};
    this.game.ui.on('PAINT.click', (e) => {
      const {x, y} = e.data.global;
      console.log(x, y, this.state.polygon)
      if (!this.state.polygon) {
        this.state.polygon = [];
      }
      if (Math.abs(this.state.polygon[0] - x) < DRAW_POLYGON_CIRCLE && Math.abs(this.state.polygon[1] - y) < DRAW_POLYGON_CIRCLE) {
        if (this.state.polygon.length > 2) {
          this.addWall(this.state.polygon);
        }
        this.state.polygon = null;
      } else {
        this.state.polygon.push(x);
        this.state.polygon.push(y);
      }
      this.render();
    });

    this.game.ui.on('SPAWN', () => this.spawn());
  }

  start() {
    this.base = new Base();
    this.base.position.set(600, 350);
    this.addEntity(this.base);

    // this.spawns[0] = new Entity();
    // this.spawns[0].position.set(0, 0);
    // this.addEntity(this.spawns[0]);

    this.polywalls.push(new Polygon([100, 100, 200, 100, 200, 200, 100, 200]));
    this.polywalls.push(new Polygon([100, 300, 100, 400, 200, 400, 200, 300]));
    this.polywalls.push(new Polygon([250, 150, 450, 100, 350, 200, 450, 300, 300, 300]));

    this.pixiwalls = this.polywalls.map(p => p.toPIXI());

    this.grid = new Grid(this.width, this.height);

    this.recalculate();
    this.render();
  }

  recalculate() {
    this.grid.recalculate((x, y, v) => {
      for (let i = 0; i < this.pixiwalls.length; ++i) {
        if (this.pixiwalls[i].contains(x, y)) {
          return 0;
        }
      }
      return 1;
    });
  }

  addEntity(entity) {
    this.entites.push(entity);
    this.gfx.addChild(entity);
    return this;
  }

  addWall(points) {
    this.polywalls.push(new Polygon(points));
    this.pixiwalls = this.polywalls.map(p => p.toPIXI());
    this.recalculate();
    this.render();
  }

  spawn() {
    const creep = new Creep(this.game);
    creep.addOrder(Orders.FOLLOW(this.base));
    this.addEntity(creep);
    console.log(creep);
  }

  update(game) {
  }

  render() {
    this.wallsGfx.clear();
    this.wallsGfx.lineStyle(1);
    this.pixiwalls.forEach(wall => {
      this.wallsGfx.drawPolygon(wall);
    });
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

    this.grid.render(this.gridGfx);
    this.entites.forEach(e => e.render());
  }
}
import * as PIXI from 'pixi.js';
import Polygon from './geom/Polygon';
import Grid from './geom/Grid';
import GridManager, {GRID_TYPE} from './managers/GridManager';

import Entity from './entites/Entity';
import Orderable from './behaviors/Orderable';
import Movable from './behaviors/Movable';
import Selectable from './behaviors/Selectable';

import Orders from './Orders';
import GameData from "./GameData";


const DRAW_POLYGON_CIRCLE = 5;

export default class Level {
  gfx = new PIXI.Container();
  spawns = [];

  actors = [];
  entites = [];
  polywalls = [];
  wallsGfx = new PIXI.Graphics();
  gridGfx = new PIXI.Graphics();
  stateGfx = new PIXI.Graphics();
  debugGfx = new PIXI.Graphics();

  constructor(game, width, height) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.cellSize = GameData.c.cellSize;
    this.gfx.addChild(this.gridGfx);
    this.gfx.addChild(this.wallsGfx);
    this.gfx.addChild(this.stateGfx);
    this.gfx.addChild(this.debugGfx);

    this.stateGfx.beginFill(0);
    this.stateGfx.drawCircle(0, 0, 20);

    this.state = {};
  }

  start() {
    this.polywalls.push(new Polygon([100, 100, 200, 100, 200, 200, 100, 200]));
    this.polywalls.push(new Polygon([100, 300, 100, 400, 200, 400, 200, 300]));
    this.polywalls.push(new Polygon([250, 150, 450, 100, 350, 200, 450, 300, 300, 300]));
    this.polywalls.push(new Polygon([80, 0, 80, 200, 0, 200, 0, 0]));

    this.pixiwalls = this.polywalls.map(p => p.toPIXI());

    this.gridManager = new GridManager(this.width, this.height, this.cellSize);

    this.base = this.addEntity('Base');
    this.base.loc.set(600, 350);

    this.recalculate();

    Array(1).fill().forEach((u, i) => this.spawn(i));

    const creep = this.addEntity('Creep');
    creep.loc.set(350, 300);
  }

  recalculate() {
    const isWall = (x, y, v) => {
      for (let i = 0; i < this.pixiwalls.length; ++i) {
        if (this.pixiwalls[i].contains(x, y)) {
          return 1023;
        }
      }
      return 1;
    };
    this.gridManager.clearCache();
    const wallsGrid = this.gridManager.getWalls();
    wallsGrid
      .forEach((value, cellIdx) => {
        const nv = isWall(
          this.gridManager.getX(cellIdx) * this.cellSize + this.cellSize / 2
          , this.gridManager.getY(cellIdx) * this.cellSize + this.cellSize / 2
          , value
        );
        if (nv !== value) wallsGrid.setCellValue(cellIdx, nv);
      })
  }

  addEntity(entityType) {
    const entity = new Entity(this.game);
    entity.type = entityType;
    entity.createActor(this.gfx);
    entity.actor.debug = new PIXI.Graphics();
    entity.actor.addChild(entity.actor.debug);
    this.entites.push(entity);
    this.actors.push(entity.actor);
    return entity;
  }

  spawn(i) {
    const creep = this.addEntity('Creep');
    creep.id = i;
    creep.loc.set(150, 250);
    Movable(creep);
    Orderable(creep);
    creep.addOrder(Orders.MOVE(this.base.loc));
  }

  addWall(points) {
    this.polywalls.push(new Polygon(points));
    this.pixiwalls = this.polywalls.map(p => p.toPIXI());
    this.recalculate();
    this.render();
  }

  update() {
    this.entites.forEach(e => e.emit('UPDATE'));

    // this.render();
  }

  getEntitiesNear(point, radius, filter = () => 1) {
    return this.entites.filter(e => filter(e) && point.dist2(e.loc) < radius * radius);
  }

  render() {
    this.wallsGfx.clear();
    this.wallsGfx.lineStyle(1, 0x0, 0.1);
    this.pixiwalls.forEach(wall => {
      this.wallsGfx.drawPolygon(wall);
    });
    this.gridManager.render(this.gridGfx);

    // this.gridGfx.clear();
    // this.gridGfx.removeChildren();
    // const gfx = this.gridGfx;
    // gfx.lineStyle(1, 0x0, 0.1);
    // const cellToLoc = (cell) => ({
    //   x: this.gridManager.getX(cell) * this.cellSize
    //   , y: this.gridManager.getY(cell) * this.cellSize
    // });
    // this.gridManager.getWalls().forEach((value, cell) => {
    //   const {x, y} = cellToLoc(cell);
    //   gfx.beginFill(value < 255 ? 0xFFFFFF : 0x0);
    //   gfx.drawRect(x, y, this.cellSize, this.cellSize);
    // });
    // for (let gridKey in this.gridManager.gridCacheDist) {
    //   const grid = this.gridManager.gridCacheDist[gridKey];
    //   gfx.lineStyle(1, 0x0000FF, 1);
    //   grid.forEach((value, cell) => {
    //     if (value) {
    //       const point = this.gridManager.getPointByCell(cell);
    //       gfx.moveTo(point.x, point.y);
    //       gfx.lineTo(point.x + value.x * .5 * this.cellSize, point.y + value.y * .5 * this.cellSize);
    //     }
    //   });
    //   break;
    // }
  }
}
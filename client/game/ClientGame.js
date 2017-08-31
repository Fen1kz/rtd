import * as PIXI from 'pixi.js';

import Base from './entites/Base';
import UIManager from "./managers/UIManager";
import {Orders} from './entites/Unit';
import Creep from './entites/Creep';
import Level from './Level';
import {CELL_SIZE} from './Cell';

const WIDTH = 800;
const HEIGHT = 400;

export default class ClientGame {
  constructor() {
    this.entites = [];


    const background = new PIXI.Graphics();
    background.beginFill(0xEEEEEE);
    background.drawRect(0, 0, WIDTH, HEIGHT);

    this.stage = new PIXI.Container();

    this.stage.addChild(background);

    this.ui = new UIManager(this);
  }

  createRenderer() {
    this.renderer = new PIXI.autoDetectRenderer(WIDTH, HEIGHT);

    return this.renderer.view;
  }

  start() {
    this.base = new Base();

    this.addEntity(this.base);

    this.ui.start(this);


    this.cliffs = new PIXI.Graphics();
    this.stage.addChild(this.cliffs);
    this.cliffsRT = PIXI.RenderTexture.create(WIDTH, HEIGHT);

    this.cliffs.lineStyle(CELL_SIZE, 0x0000FF);
    this.cliffs.moveTo(300, 100);
    this.cliffs.lineTo(200, 200);
    this.cliffs.lineTo(400, 300);
    this.cliffs.lineTo(400, 400);

    this.cliffs.lineStyle(0);
    this.cliffs.beginFill(0x0000FF);

    this.gridGfx = new PIXI.Graphics();
    this.stage.addChild(this.gridGfx);

    this.level = new Level(Math.floor(WIDTH / CELL_SIZE), Math.floor(HEIGHT / CELL_SIZE)).fill();
    window.level = this.level;

    this.level.cells.forEach(c => this.gridGfx.addChild(c.gfx));

    this.tick();
    this.recalculatePathing();

    this.spawn();
  }

  recalculatePathing() {
    this.renderer.render(this.cliffs, this.cliffsRT);
    const pixels = this.renderer.extract.pixels(this.cliffsRT);

    const probe = (x, y) => {
      const index = 4 * (Math.floor(x) + Math.floor(y) * WIDTH);
      return pixels[index + 3];
    };

    this.level.recalculateWalls(probe);
    this.setBase({x: 30 * CELL_SIZE, y: 15 * CELL_SIZE});

    this.entites.forEach(e => {
      if (e.path) e.path = void 0;
    })
  }

  tick = () => {
    this.update();

    this.renderer.render(this.stage);

    window.requestAnimationFrame(this.tick);
  };

  update() {
    this.entites.forEach(e => e.update(this));
  }

  addEntity(entity) {
    this.entites.push(entity);
    this.stage.addChild(entity.gfx);
    return this;
  }

  setBase(loc) {
    const cell = this.level.findCell(loc);
    this.base.setXY(cell.x, cell.y);
    this.level.recalculatePathing(cell);
    this.level.cells.forEach(c => c.render(this));
  }

  addWall(p) {
    this.addEntity(new Creep()
      .setLoc(p))
  }

  spawn() {
    const creep = new Creep();
    creep.addOrder(Orders.FOLLOW(this.base));

    this.addEntity(creep);
  }
}
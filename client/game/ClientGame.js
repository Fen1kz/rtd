import * as PIXI from 'pixi.js';

import Base from './entites/Base';
import UIManager from "./managers/UIManager";
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
    this.base.setXY(30, 15);

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

    this.level.cells.forEach(c => this.gridGfx.addChild(c.gfx));

    this.tick();
    this.recalculatePathing();
  }

  recalculatePathing() {
    this.renderer.render(this.cliffs, this.cliffsRT);
    const pixels = this.renderer.extract.pixels(this.cliffsRT);

    const probe = (x, y) => {
      const index = 4 * (Math.floor(x) + Math.floor(y) * WIDTH);
      return pixels[index + 3];
    };

    this.level.recalculateWalls(probe);
    this.level.recalculatePathing(this.base.loc.x, this.base.loc.y);
    this.level.cells.forEach(c => c.render());
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

  addWall(p) {
    this.addEntity(new Creep()
      .setLoc(p))
  }

  spawn() {
    const creep = new Creep();
    creep.addMoveOrder(this.base.loc);

    this.addEntity(creep);
  }
}
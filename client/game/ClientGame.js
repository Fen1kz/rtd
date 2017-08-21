import * as PIXI from 'pixi.js';

import Base from './entites/Base';
import UIManager from "./managers/UIManager";
import Creep from './entites/Creep';

const WIDTH = 800;
const HEIGHT = 800;
const GRID_SIZE = 10;

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
    this.base.setXY(400, 200);

    this.addEntity(this.base);

    this.ui.start(this);


    this.cliffs = new PIXI.Graphics();
    this.stage.addChild(this.cliffs);
    this.cliffsRT = PIXI.RenderTexture.create(WIDTH, HEIGHT);

    this.cliffs.lineStyle(GRID_SIZE, 0x0000FF);
    // this.cliffs.moveTo(300, 100);
    // this.cliffs.lineTo(200, 200);
    // this.cliffs.lineTo(400, 300);
    // this.cliffs.lineTo(400, 400);

    this.cliffs.lineStyle(0);
    this.cliffs.beginFill(0x0000FF);

    this.gridGfx = new PIXI.Graphics();
    this.stage.addChild(this.gridGfx);

    this.grid = Array(WIDTH / GRID_SIZE).fill().map((u, x) =>
      Array(HEIGHT / GRID_SIZE).fill().map((u, y) => {
        return {
          x, y
        }
      })
    );

    this.tick();
    this.recalculatePathing();
  }

  recalculatePathing() {
    // this.renderer.render(this.entitesContainer, this.cliffsRT);
    this.renderer.render(this.cliffs, this.cliffsRT);
    const pixels = this.renderer.extract.pixels(this.cliffsRT);

    this.gridGfx.clear();
    this.gridGfx.lineStyle(1, 0x00FF00, .33);

    const probe = (x, y) => {
      const index = 4 * (Math.floor(x) + Math.floor(y) * WIDTH);
      return pixels[index + 3];
    };
    this.grid.forEach((row, i) => row.forEach((cell) => {
      const cx = cell.x * GRID_SIZE + GRID_SIZE / 2;
      const cy = cell.y * GRID_SIZE + GRID_SIZE / 2;
      if (
        probe(cx, cy)
        || probe(cx - GRID_SIZE / 3, cy - GRID_SIZE / 3)
        || probe(cx - GRID_SIZE / 3, cy + GRID_SIZE / 3)
        || probe(cx + GRID_SIZE / 3, cy + GRID_SIZE / 3)
        || probe(cx + GRID_SIZE / 3, cy - GRID_SIZE / 3)
        // || probe(cx - GRID_SIZE / 3, cy - GRID_SIZE / 3)
        // || probe(cx - GRID_SIZE / 3, cy + GRID_SIZE / 3)
        // || probe(cx + GRID_SIZE / 3, cy + GRID_SIZE / 3)
        // || probe(cx + GRID_SIZE / 3, cy - GRID_SIZE / 3)
      ) {
        cell.wall = true;
      } else {
        cell.wall = false;
      }
      if (cell.wall) {
        this.gridGfx.beginFill(0x0, .5);
      }
      this.gridGfx.drawRect(cell.x * GRID_SIZE, cell.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      this.gridGfx.endFill();
    }));
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
import * as PIXI from 'pixi.js';

import Base from './entites/Base';
import UIManager from "./managers/UIManager";
import Creep from './entites/Creep';

export default class ClientGame {
  constructor() {
    this.entites = [];
    this.ui = new UIManager();
  }

  createRenderer() {
    this.renderer = new PIXI.autoDetectRenderer(500, 500);
    this.stage = new PIXI.Container();

    this.renderer.backgroundColor = 0xEEEEEE;

    return this.renderer.view;
  }

  start() {
    this.base = new Base();
    this.base.setXY(400, 200);

    this.addEntity(this.base);

    window.requestAnimationFrame(this.tick);
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
    return entity;
  }

  spawn() {
    const creep = new Creep();
    creep.addMoveOrder(this.base.loc);

    this.addEntity(creep);
  }
}
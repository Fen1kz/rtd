import * as PIXI from 'pixi.js';

import UIManager from "./managers/UIManager";
import Level from './Level';
import commands from './commands';

import './actors/CircleActor';
import './actors/CreepActor';

const WIDTH = 800;
const HEIGHT = 600;

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
    this.ui.start(this);

    this.level = new Level(this, WIDTH, HEIGHT);
    window.level = this.level;
    this.stage.addChild(this.level.gfx);

    this.level.start();

    commands(this);

    this.tick();

    this.level.render();
  }

  tick = () => {
    this.update();

    this.renderer.render(this.stage);

    window.requestAnimationFrame(this.tick);
    // setTimeout(this.tick, 250);
  };

  update() {
    this.level.update(this);
  }
}
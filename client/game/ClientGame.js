import * as PIXI from 'pixi.js';

import UIManager from "./managers/UIManager";
import Level from './Level';

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
    this.ui.start(this);

    this.level = new Level(WIDTH, HEIGHT);
    this.stage.addChild(this.level.gfx);
    window.level = this.level;

    this.level.start();

    this.tick();
  }

  tick = () => {
    this.update();

    this.renderer.render(this.stage);

    window.requestAnimationFrame(this.tick);
  };

  update() {
    this.level.update(this);
  }
}
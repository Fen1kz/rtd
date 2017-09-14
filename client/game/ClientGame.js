import * as PIXI from 'pixi.js';

import UIManager from "./managers/UIManager";
import Level from './Level';

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
    this.stage.addChild(this.level.gfx);
    // this.level.gfx.position.set(50, 50);
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
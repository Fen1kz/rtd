import {Graphics} from 'pixi.js';

export default class Actor extends Graphics {
  constructor(gfx, entity) {
    super();
    this.entity = entity;
    gfx.addChild(this);
    this.render();
    this.cacheAsBitmap = true;
  }
}
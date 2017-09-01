import {Container, Graphics} from 'pixi.js';

export default class Entity extends Container {
  gfx = new Graphics();

  constructor(x, y) {
    super(x, y);
    this.addChild(this.gfx);
    this.gfx.cacheAsBitmap = true;
  }

  update() {
  }

  render() {
    this.gfx.clear();
  }
}
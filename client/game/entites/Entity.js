import {Container, Graphics, ObservablePoint} from 'pixi.js';
import Point from '../geom/Point';
import ClientGame from '../ClientGame';

export default class Entity {
  radius = 10;
  gfx = new Graphics();

  constructor(game, x, y) {
    if (!(game instanceof ClientGame)) throw new Error('Wrong Entity: ' + this.constructor.name);
    this.game = game;
    this.gfx.cacheAsBitmap = true;
    this.loc = new Point(x, y).toObservable((loc) => this.gfx.position.set(loc.x, loc.y));
  }

  update() {
  }

  render() {
    this.gfx.clear();
  }
}
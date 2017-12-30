import EventEmitter from 'events';

import Point from '../geom/Point';
import ClientGame from '../ClientGame';

import GameData from '../GameData';

export default class Entity extends EventEmitter {
  type = null;
  actor = null;
  loc = new Point();
  radius = 5;

  constructor(game) {
    super();
    if (!(game instanceof ClientGame)) throw new Error('Wrong Entity: ' + this.constructor.name);
    this.game = game;
  }

  createActor(gfx) {
    const unitData = GameData.entity[this.type];
    const ActorClass = GameData.actor[unitData.actor]._class;
    this.actor = new (ActorClass)(gfx, this);
    // this.actor.cacheAsBitmap = true;
    this.loc = this.loc.toObservable((loc) => this.actor.position.set(loc.x, loc.y));
    return this;
  }

  toString() {
    return `${this.type}#${this.id}${this.loc}`;
  }
}
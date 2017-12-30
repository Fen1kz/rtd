import Actor from './Actor';
import GameData from '../GameData';

const data = GameData.actor.CircleActor;

export default class CircleActor extends Actor {
  render() {
    this.clear();
    this.lineStyle(1, 0x0);
    this.beginFill(data.color || 0xFF0000);
    this.drawCircle(0, 0, data.r || GameData.c.cellSize / 2);
    this.endFill();
  }
}

GameData.actor.CircleActor._class = CircleActor;
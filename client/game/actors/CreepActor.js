import Actor from './Actor';
import GameData from '../GameData';

const data = GameData.actor.CreepActor;

export default class CreepActor extends Actor {
  render() {
    this.clear();
    this.lineStyle(1, 0x0);
    if (data.color) this.beginFill(data.color);
    this.drawCircle(0, 0, data.r || this.entity.radius);
    this.moveTo(0, 0);
    this.lineTo(this.entity.radius, 0);
    this.endFill();
  }
}

GameData.actor.CreepActor._class = CreepActor;
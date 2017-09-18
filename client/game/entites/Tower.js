import Unit from './Unit';
import Point from '../geom/Point';
import {GRID_TYPE} from '../managers/GridManager';

export default class Tower extends Unit {


  render() {
    this.gfx.clear();
    this.gfx.lineStyle(1);
    this.gfx.beginFill(0xFF0000);
    this.gfx.drawCircle(0, 0, this.radius);
    this.gfx.endFill();

    this.gfx.lineStyle(1, 0x0000FF);
  }
}


























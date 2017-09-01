import Entity from './Entity';

export default class Base extends Entity {
  render() {
    super.render();
    this.gfx.beginFill(0xFF0000);
    this.gfx.drawCircle(0, 0, 15);
  }
}
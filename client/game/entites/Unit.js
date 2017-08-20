import Entity from './Entity';

export default class Unit extends Entity {
  speed = 1;

  addMoveOrder(loc) {
    this.orderLoc = loc;
  }

  update() {
    if (this.orderLoc) {
      const orderLoc = this.orderLoc;
      const dist2 = this.loc.dist2(orderLoc);
      if (dist2 > 100) {
        const angle = this.loc.angleTo(orderLoc);
        this.setXY(
          this.loc.x + this.speed * Math.cos(angle)
          , this.loc.y + this.speed * Math.sin(angle)
        );
      } else {
        this.orderLoc = null;
      }
    }
  }
}
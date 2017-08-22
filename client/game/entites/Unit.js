import Entity from './Entity';

export default class Unit extends Entity {
  speed = .1;

  addMoveOrder(loc) {
    this.orderLoc = loc;
  }

  update(game) {
    if (this.orderLoc) {
      if (!this.currentCell) {
        this.currentCell = game.level.findCell(this.loc);
        this.nextCell = this.currentCell.exit;
      }
      const actualCell = game.level.findCell(this.loc);
      if (actualCell === this.nextCell) {
        this.currentCell = actualCell;
        this.nextCell = this.currentCell.exit;
      }
      if (!this.nextCell) {
        return null;
      }

      const orderLoc = this.nextCell;
      const dist2 = this.loc.dist2(orderLoc);
      const angle = this.loc.angleTo(orderLoc);
      this.setXY(
        this.loc.x + this.speed * Math.cos(angle)
        , this.loc.y + this.speed * Math.sin(angle)
      );
    }
  }
}
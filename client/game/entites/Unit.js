import Entity from './Entity';
//
// const lerp = (s, e, t) => s + t * (e - s);
// const lerpPoint = (p0, p1, t) => new Point(lerp(p0.x, p1.x, t), lerp(p0.y, p1.y, t));
// const diagonalDist = (p0, p1) => {
//   let dx = p1.x - p0.x, dy = p1.y - p0.y;
//   return Math.max(Math.abs(dx), Math.abs(dy));
// };
// const roundPoint = (p) => new Point(Math.round(p.x), Math.round(p.y));
//
// const getLOS = (game, p0, p1) => {
//   const line = [];
//   const steps = diagonalDist(p0, p1);
//   for (let step = 0; step < steps; ++step) {
//     let t = steps === 0 ? 0 : step / steps;
//     const point = lerpPoint(p0, p1, t);
//     line.push(game.level.getCell(Math.round(point.x), Math.round(point.y)));
//   }
//   return line;
// };

const OrderTypes = {
  FOLLOW: {
    replace: true
    , update: (game, unit, order) => {
      // if (!unit.path) {
      //   const unitCell = game.level.findCell(unit.loc);
      //   unit.path = [];
      //   let cell = unitCell;
      //   let prevCell = unitCell;
      //   while (cell.exit) {
      //     const LOS = getLOS(game, prevCell, cell.exit);
      //     if (LOS.some(c => c.wall)) {
      //       unit.path.push(cell);
      //       prevCell = cell;
      //     }
      //     cell = cell.exit;
      //   }
      //   unit.path.push(cell);
      //
      //   unit.render(game);
      //   console.log('unit path is', unit.path)
      // }
      // const nextCell = unitCell.exit;
    }
  }
};

export const Orders = {
  FOLLOW: (entity) => ({type: 'FOLLOW', entity})
};

export default class Unit extends Entity {
  speed = 10;
  orders = [];

  addOrder(order) {
    this.orders.push(order);
  }

  update(game) {
    this.orders.forEach(order => {
      const orderData = OrderTypes[order.type];
      orderData.update(game, this, order);
    });
    // if (this.orderLoc) {
    //   if (!this.currentCell) {
    //     this.currentCell = game.level.findCell(this.loc);
    //     this.nextCell = this.currentCell.exit;
    //   }
    //   const actualCell = game.level.findCell(this.loc);
    //   if (actualCell === this.nextCell) {
    //     this.currentCell = actualCell;
    //     this.nextCell = this.currentCell.exit;
    //   }
    //   if (!this.nextCell) {
    //     return null;
    //   }
    //
    //   const orderLoc = this.nextCell;
    //   const dist2 = this.loc.dist2(orderLoc);
    //   const angle = this.loc.angleTo(orderLoc);
    //   this.setXY(
    //     this.loc.x + this.speed * Math.cos(angle)
    //     , this.loc.y + this.speed * Math.sin(angle)
    //   );
    // }
  }

  render(game) {
    this.gfx.clear();
    this.gfx.beginFill(0xFF0000);
    this.gfx.drawCircle(0, 0, 8);
    this.gfx.endFill();

    this.gfx.lineStyle(1, 0x0000FF);
    if (this.path) {
      this.gfx.moveTo(0, 0);
      this.path.forEach(c => {
        const x = c.gfx.x;
        const y = c.gfx.y;
        this.gfx.lineTo(x, y);
      });
      this.gfx.beginFill(0x0000FF);
      this.path.forEach(c => {
        const x = c.gfx.x;
        const y = c.gfx.y;
        this.gfx.drawCircle(x, y, 4);
      });

      this.gfx.beginFill(0xFF00FF);
      for (let i = -1; 1 + i < this.path.length; ++i) {
        const c0 = (i === -1) ? game.level.findCell(this.loc) : this.path[i];
        const c1 = this.path[i + 1];
        const line = getLOS(game, c0, c1);
        line.forEach(c => {
          this.gfx.drawCircle(c.gfx.x, c.gfx.y, 2);
        })
      }
    }
  }
}


























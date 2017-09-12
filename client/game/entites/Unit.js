import Entity from './Entity';
import Point from '../geom/Point';

const OrderTypes = {
  FOLLOW: {
    update: (game, unit, order) => {
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
  , MOVE: {
    onStart: (game, unit, order) => {
      const grid = game.level.grid;
      const {x, y} = grid.getCellByPixels(order.point);
      order.tcx = x; // target cell x
      order.tcy = y;
      order.tx = grid.getCCP(x);
      order.ty = grid.getCCP(y);
      grid.getFF(x, y);
    }
    , onUpdate: (game, unit, order) => {
      const grid = game.level.grid;
      const {tcx, tcy, tx, ty} = order;

      const FF = grid.getFF(tcx, tcy);
      const {x: ucx, y: ucy} = grid.getCellByPixels(unit.loc);
      if (ucx === tcx && ucy === tcy) {
        unit.radius = 0;
        unit.orders = [];
        game.level.entites.splice(game.level.entites.indexOf(unit), 1);
      }

      const unitOnWall = grid.getNDValue(grid.cells, ucx, ucy) > 255;
      if (!unitOnWall) {
        order.ucx = ucx;
        order.ucy = ucy;
      }

      let FFvalue = FF.get(order.ucx, order.ucy);

      if (FFvalue === void 0) {
        FFvalue = [tcx, tcy];
      }

      const nx = grid.getCCP(FFvalue[0]);
      const ny = grid.getCCP(FFvalue[1]);

      const angle = Math.atan2(ny - unit.loc.y, nx - unit.loc.x);

      const centerOfMass = unit.loc.clone();
      centerOfMass.value = 0;
      if (!unitOnWall) {
        const entites = game.level.entites.filter(entity =>
          entity.constructor.name === 'Creep'
          && entity !== unit
          && unit.loc.dist2(entity.loc) < (unit.radius + entity.radius) * (unit.radius + entity.radius)
        );
        entites.forEach((entity) => {
          centerOfMass.set((centerOfMass.x + entity.loc.x) / 2, (centerOfMass.y + entity.loc.y) / 2);
          centerOfMass.value += .5;
        });
        if (centerOfMass.value > 1) centerOfMass.value = 1;
      }

      const comAngle = centerOfMass.angleTo(unit.loc) + Math.random();
      const forceTarget = new Point().polar(unit.speed * (1 - centerOfMass.value), angle);
      const forceCOM = new Point().polar(unit.speed * (centerOfMass.value), comAngle);
      const force = new Point(
        forceTarget.x + forceCOM.x
        , forceTarget.y + forceCOM.y
      );

      unit.loc.set(
        unit.loc.x + force.x
        , unit.loc.y + force.y
      );
    }
  }
};

export const Orders = {
  FOLLOW: (entity) => ({type: 'FOLLOW', entity})
  , MOVE: (point) => ({type: 'MOVE', point})
};

export default class Unit extends Entity {
  speed = 1;
  orders = [];

  addOrder(order) {
    const orderData = OrderTypes[order.type];
    if (orderData.onStart) orderData.onStart(this.game, this, order);
    this.orders.push(order);
  }

  update() {
    this.orders.forEach(order => {
      const orderData = OrderTypes[order.type];
      orderData.onUpdate(this.game, this, order);
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

  render() {
    this.gfx.clear();
    this.gfx.lineStyle(1);
    this.gfx.beginFill(0xFF0000);
    this.gfx.drawCircle(0, 0, this.radius);
    this.gfx.endFill();

    this.gfx.lineStyle(1, 0x0000FF);
  }
}


























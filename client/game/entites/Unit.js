import Entity from './Entity';
import Point from '../geom/Point';
import {GRID_TYPE} from '../managers/GridManager';

const OrderTypes = {
  FOLLOW: {
    onUpdate: (game, unit, order) => {
      order.point = order.entity.loc;
      OrderTypes.MOVE.onStart(game, unit, order);
      OrderTypes.MOVE.onUpdate(game, unit, order);
    }
  }
  , MOVE: {
    onStart: (game, unit, order) => {
      const gridManager = game.level.gridManager;
      order.targetCell = gridManager.getWalls().getCellByPoint(order.point);
      order.gridKey = gridManager.makeGridKey(GRID_TYPE.FLOWFIELD, order.targetCell[0], order.targetCell[1]);

      const grid = gridManager.getGrid(order.gridKey);
      order.targetPoint = grid.getPointByCell(order.targetCell);
    }
    , onUpdate: (game, unit, order) => {
      const level = game.level;
      const gridManager = game.level.gridManager;
      const gridWalls = gridManager.getWalls();
      const gridFF = gridManager.getGrid(order.gridKey);

      const localTargetCell = gridFF.getCellValueByPoint(unit.loc);


      let localTargetPoint = localTargetCell !== void 0
        ? gridFF.getPointByCell(localTargetCell)
        : order.targetPoint;
      const desiredVel = new Point(localTargetPoint).sub(unit.loc).norm();

      // // Arrival
      // const arrivalDist = unit.loc.dist2(order.targetPoint);
      // const arrivalRadius = Math.pow(unit.radius, 2);
      // if (arrivalDist < arrivalRadius) {
      //   desiredVel.mul(arrivalDist / arrivalRadius);
      //   if (desiredVel.len2() < 1) {
      //     unit.vel.set(0, 0);
      //     return;
      //   }
      // }

      const seekForce = new Point(desiredVel).sub(unit.vel);

      // Unit
      const unitsC = level.getEntitiesNear(unit.loc, unit.radius, e => e !== unit);

      const collUnitsForce = new Point();
      if (unitsC.length > 0) {
        const com = new Point();
        unitsC.forEach((u, i) => {
          com.add(u.loc).mul(i === 0 ? 1 : .5)
        });
        collUnitsForce.copy(new Point(unit.loc).sub(com));
      }

      // Wall
      const collWallsForce = new Point();
      const wallCheckPoints = Array(4).fill().map((u, i) => new Point()
        .polar(unit.radius, Math.PI * i * .5)
        .add(unit.loc))
        .filter(p => gridWalls.getCellValueByPoint(p) > 255);
      if (wallCheckPoints.length > 0) {
        const comW = new Point();
        wallCheckPoints
          .forEach((p, i) => {
            comW.add(p).mul(i === 0 ? 1 : .5)
          });
        collWallsForce.copy(new Point(unit.loc).sub(comW));
      }

      const steering = new Point();
      steering.add(seekForce);
      steering.trunc(unit.accel);
      steering.add(collUnitsForce.norm());
      steering.add(collWallsForce.norm());

      unit.vel.add(steering).trunc(1);

      if (isNaN(unit.vel.x)) debugger
    }
  }
};

export const Orders = {
  FOLLOW: (entity) => ({type: 'FOLLOW', entity})
  , MOVE: (point) => ({type: 'MOVE', point})
};

export default class Unit extends Entity {
  accel = .2;
  speed = 2.5;
  vel = new Point();
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
    if (this.vel.x !== 0 || this.vel.y !== 0) {
      this.loc.set(
        this.loc.x + this.speed * this.vel.x
        , this.loc.y + this.speed * this.vel.y
      );
    }
  }

  render() {
    this.gfx.clear();
    this.gfx.lineStyle(1);
    this.gfx.beginFill(0xFF0000);
    this.gfx.drawCircle(0, 0, this.radius);
    this.gfx.endFill();

    // const unit = this;
    // const ahead = new Point(unit.vel).mul(unit.speed + unit.radius);
    // const aheadl = new Point(ahead).rotate(1);
    // this.gfx.drawCircle(ahead.x, ahead.y, 2);
    // this.gfx.drawCircle(aheadl.x, aheadl.y, 2);

    this.gfx.lineStyle(1, 0x0000FF);
  }
}


























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
      const debugCircle = (p, color, r = 2, opacity = 1) => {
        // const debugp = new Point(p);//.mul(unit.radius);
        // unit.gfx.beginFill(color, opacity);
        // unit.gfx.drawCircle(debugp.x, debugp.y, r);
      };
      const level = game.level;
      const gridManager = game.level.gridManager;
      const gridWalls = gridManager.getWalls();
      const gridFF = gridManager.getGrid(order.gridKey);

      // let localTargetCell;
      // let localTargetPoint;
      // const unitOnWall = gridWalls.getCellValueByPoint(unit.loc) > 255;
      // if (unitOnWall) {
      //   localTargetPoint = order.unitLoc;
      //   debugCircle(new Point(), 0xFF00FF, 15);
      // } else {
      //   order.unitLoc = new Point(unit.loc);
      //   localTargetCell = gridFF.getCellValueByPoint(order.unitLoc);
      // }
      let localTargetPoint;
      const localTargetCell = gridFF.getCellValueByPoint(unit.loc);


      if (localTargetPoint === void 0 && localTargetCell !== void 0) {
        localTargetPoint = gridFF.getPointByCell(localTargetCell);
      } else {
        localTargetPoint = order.targetPoint;
      }
      const desiredVel = new Point(localTargetPoint).sub(unit.loc).norm();
      // debugCircle(new Point(localTargetPoint).sub(unit.loc), 0x00FF00);

      // // Arrival
      const arrivalDist = unit.loc.dist2(order.targetPoint);
      const arrivalRadius = Math.pow(unit.radius, 2);
      if (arrivalDist < arrivalRadius) {
        desiredVel.mul(arrivalDist / arrivalRadius);
        if (desiredVel.len2() < 1) {
          unit.vel.set(0, 0);
          return;
        }
      }

      const seekForce = new Point(desiredVel).sub(unit.vel);

      // Collision
      // debugCircle(new Point(aheadU).rotate(1), 0x0000FF);
      // debugCircle(new Point(aheadU).rotate(1), 0x0000FF, unit.radius, 0.1);
      // debugCircle(new Point(aheadU).rotate(-1), 0x0000FF);
      // debugCircle(new Point(aheadU).rotate(-1), 0x0000FF, unit.radius, 0.1);

      // Unit
      const aheadU = new Point(unit.vel).mul(unit.speed);
      const aheadC = new Point(aheadU).add(unit.loc);
      // const aheadR = new Point(aheadU).rotate(1).add(unit.loc);
      // const aheadL = new Point(aheadU).rotate(-1).add(unit.loc);

      const unitsC = level.getEntitiesNear(unit.loc, unit.radius, e => e !== unit);
      // const unitsR = level.getEntitiesNear(aheadR, unit.radius, e => e !== unit);
      // const unitsL = level.getEntitiesNear(aheadL, unit.radius, e => e !== unit);

      // console.log(unitsC.length, level.getEntitiesNear(aheadC, unit.radius, e => e !== unit), level.getEntitiesNear(aheadC, unit.radius))
      const collUnitsForce = new Point();
      if (unitsC.length > 0) {
        const com = new Point();
        unitsC.forEach((u, i) => {
          com.add(u.loc).mul(i === 0 ? 1 : .5)
        });
        collUnitsForce.copy(new Point(unit.loc).sub(com));
      }

      // Wall
      const unitOnWall = gridWalls.getCellValueByPoint(new Point(unit.loc).polar(unit.radius, Math.PI * 0.0)) > 255;
      const unitOnWall2 = gridWalls.getCellValueByPoint(new Point(unit.loc).polar(unit.radius, Math.PI * 0.5)) > 255;
      const unitOnWall3 = gridWalls.getCellValueByPoint(new Point(unit.loc).polar(unit.radius, Math.PI * 1.0)) > 255;
      const unitOnWall4 = gridWalls.getCellValueByPoint(new Point(unit.loc).polar(unit.radius, Math.PI * 1.5)) > 255;
      const unitOnWall5 = gridWalls.getCellValueByPoint(new Point(unit.loc).polar(unit.radius, Math.PI * 2.0)) > 255;

      const collWallsForce = new Point();
      const wallCheckPoints = Array(8).fill().map((u, i) => new Point()
        .polar(unit.radius, Math.PI * i * .25)
        .add(unit.loc))
        .filter(p => gridWalls.getCellValueByPoint(p) > 255);
      if (wallCheckPoints.length > 0) {
        const comW = new Point();
        wallCheckPoints
          .forEach((p, i) => {
            debugCircle(new Point(p).sub(unit.loc), 0xFFFF00, 10);
            comW.add(p).mul(i === 0 ? 1 : .5)
          });
        collWallsForce.copy(new Point(unit.loc).sub(comW));
      }


      // const aheadWall = new Point(collUnitsForce).polar(unit.radius, aheadU.angle());
      // const aheadWallPoint = new Point(aheadWall).add(unit.loc);

      // gridWalls.getNear8(gridWalls.getCellValueByPoint(unit.loc))
      // if (gridWalls.getCellValueByPoint(aheadWallPoint) > 255) {
      // const collWallsForce = new Point();
      // if (unitOnWall) {
      //   collWallsForce.add(new Point(unit.loc).sub(gridWalls.getPointByCell(gridWalls.getCellByPoint(unit.loc))));
      // }
      debugCircle(collWallsForce, 0xFF00FF, 5);

      const steering = new Point();
      steering.add(seekForce);
      steering.add(collUnitsForce.norm());
      steering.add(collWallsForce.norm());

      unit.vel.add(steering).trunc(1);

      if (isNaN(unit.vel.x)) debugger
      // level.getEntitiesNear(ahead, unit.radius, e => e !== unit)
      // const avoidanceForce = new Point();
      // if (grid.getPointPathing(ahead) > 255) {
      //   // // const obstacleCenter = grid.getCellCenterByPixels(ahead);
      //   // let obstacleCenter = grid.getFFNextPoint(order.FFKey, ahead);
      //   // if (!obstacleCenter) {
      //   //   obstacleCenter = grid.getFFNextPoint(order.FFKey, unit.loc);
      //   // }
      //   // if (obstacleCenter) {
      //   //   const diff = ahead.sub(obstacleCenter).norm();
      //   //   avoidanceForce.copy(diff);//.mul(diff.len());
      //   // }
      //   // console.log(avoidanceForce)
      // }
    }
  }
};

export const Orders = {
  FOLLOW: (entity) => ({type: 'FOLLOW', entity})
  , MOVE: (point) => ({type: 'MOVE', point})
};

export default class Unit extends Entity {
  accel = .5;
  speed = 1.5;
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
    // const nextLoc = this.vel.clone().mul(this.speed).add(this.loc);
    // const units = this.game.level.getUnitsNear(nextLoc, this.radius);
    // if ()
    if (this.vel.x !== 0 || this.vel.y !== 0) {
      this.loc.set(
        this.loc.x + this.speed * this.vel.x
        , this.loc.y + this.speed * this.vel.y
      );
    }
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

    // const unit = this;
    // const ahead = new Point(unit.vel).mul(unit.speed + unit.radius);
    // const aheadl = new Point(ahead).rotate(1);
    // this.gfx.drawCircle(ahead.x, ahead.y, 2);
    // this.gfx.drawCircle(aheadl.x, aheadl.y, 2);

    this.gfx.lineStyle(1, 0x0000FF);
  }
}


























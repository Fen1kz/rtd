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
      const [x, y] = grid.getCellByPixels(order.point);
      order.FFKey = grid.makeFFKey(x, y);
      order.targetPoint = new Point(grid.getCCP(x), grid.getCCP(y));
    }
    , onUpdate: (game, unit, order) => {
      const debugCircle = (p, color, r = 5, opacity = 1) => {
        const debugp = new Point(p).mul(unit.radius);
        unit.gfx.beginFill(color, opacity);
        unit.gfx.drawCircle(debugp.x, debugp.y, r);
      };
      const level = game.level;
      const grid = game.level.grid;

      const unitOnWall = grid.getPointPathing(unit.loc) > 255;
      if (!unitOnWall) {
        order.unitLoc = new Point(unit.loc);
      }

      let FFPoint = grid.getFFNextPoint(order.FFKey, order.unitLoc);

      if (FFPoint === void 0) {
        FFPoint = order.targetPoint;
      }

      const desiredVel = new Point(FFPoint).sub(unit.loc).norm();
      debugCircle(desiredVel, 0xFFFF001);

      // Arrival
      const arrivalDist = unit.loc.dist2(order.targetPoint);
      const arrivalRadius = Math.pow(unit.radius, 2);
      if (arrivalDist < arrivalRadius) {
        desiredVel.mul(arrivalDist / arrivalRadius);
        if (desiredVel.len2() < 1) {
          desiredVel.set(0, 0);
        }
      }

      const seekForce = new Point(desiredVel).sub(unit.vel);

      const steering = new Point();
      steering.add(seekForce);
      steering.trunc(unit.accel);

      unit.vel.add(steering).trunc(1);

      // Collision
      const aheadV = new Point(unit.vel).mul(unit.speed);
      debugCircle(aheadV, 0x0000FF);
      debugCircle(aheadV, 0x0000FF, unit.radius, 0.1);
      debugCircle(new Point(aheadV).rotate(1), 0x0000FF);
      debugCircle(new Point(aheadV).rotate(1), 0x0000FF, unit.radius, 0.1);
      debugCircle(new Point(aheadV).rotate(-1), 0x0000FF);
      debugCircle(new Point(aheadV).rotate(-1), 0x0000FF, unit.radius, 0.1);


      // Wall
      // const collisionWall = new Point();
      // if (grid.getPointPathing(ahead) > 255) {
      //
      // }

      // Unit
      const aheadC = new Point(aheadV).add(unit.loc);
      const aheadR = new Point(aheadV).rotate(1).add(unit.loc);
      const aheadL = new Point(aheadV).rotate(-1).add(unit.loc);

      const unitsC = level.getEntitiesNear(aheadC, unit.radius, e => e !== unit);
      const unitsR = level.getEntitiesNear(aheadR, unit.radius, e => e !== unit);
      const unitsL = level.getEntitiesNear(aheadL, unit.radius, e => e !== unit);

      if (unitsC.length === 0) {
      // } else if (unitsR.length === 0) {
      //   console.log('unitsR');
      //   unit.vel.rotate(1);
      // } else if (unitsL.length === 0) {
      //   console.log('unitsL');
      //   unit.vel.rotate(-1);
      } else {
        const com = new Point();
        unitsC.forEach((u, i) => {
          com.add(u.loc).mul(i === 0 ? 1 : .5)
        });
        // const dv = com.sub(unit.loc).norm()
        // unit.vel.copy(com.sub(unit.loc).norm().mul(-1));
        // unit.vel.mul(-1);
      }


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
  accel = .05;
  speed = 2;
  vel = new Point();
  orders = [];

  addOrder(order) {
    const orderData = OrderTypes[order.type];
    if (orderData.onStart) orderData.onStart(this.game, this, order);
    this.orders.push(order);
  }

  update() {
    this.render();
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


























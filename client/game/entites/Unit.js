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
      const forceUnits = new Point(0, 0);
      const unitVel = new Point(0, 0);

      if (unit.collided) {
        unit.vel.set(0, 0);
        unit.collided = false;
      }

      function predictUnitLoc(vel) {
        return new Point(vel).mul(unit.speed).add(unit.loc);
      }

      const unitLocPredicted = predictUnitLoc(unit.vel);

      {
        const unitsC = level.getEntitiesNear(unitLocPredicted, unit.radius * 2, e => e !== unit);
        if (unitsC.length > 0) {
          const com = new Point();
          unitsC.forEach((u, i) => {
            com.add(u.loc).mul(i === 0 ? 1 : .5)
          });
          let dist = new Point(unit.loc).sub(com).norm();
          if (dist.len2() === 0) {
            dist = new Point(1 - Math.random() * 2, 1 - Math.random() * 2)
          }
          forceUnits.add(dist);
        }

        const forceWalls = new Point();
        const localWallCell = gridWalls.getCellByPoint(unitLocPredicted);
        const wallcheck = [
          [localWallCell[0] + 0, localWallCell[1] + 0]
          , [localWallCell[0] + 1, localWallCell[1] + 0]
          , [localWallCell[0] + 0, localWallCell[1] + 1]
          , [localWallCell[0] - 1, localWallCell[1] + 0]
          , [localWallCell[0] + 0, localWallCell[1] - 1]
          , [localWallCell[0] + 1, localWallCell[1] - 1]
          , [localWallCell[0] + 1, localWallCell[1] + 1]
          , [localWallCell[0] - 1, localWallCell[1] + 1]
          , [localWallCell[0] - 1, localWallCell[1] - 1]
        ]
          .filter((cell) => gridWalls.getCellValue(cell) > 255)
          .forEach((cell) => {
            const cellPoint = gridWalls.getPointByCell(cell);
            if (intersects(cellPoint, unit)) {
              const dist = new Point(unit.loc).sub(cellPoint).norm();
              // forceWalls.set(1 - dist.x, 1 - dist.y).mul(-1);
              forceWalls.copy(dist);
            }
          });

        // unit.vel.norm();

        // console.log(unit.id, forceUnits.toPolarString(), forceWalls.toPolarString());
        if (forceWalls.not0()) {
          unitVel.add(forceWalls);
        } else {
          unitVel.add(forceUnits);
        }
        if (unitVel.not0()) {
          unit.collided = true;
          unit.vel.copy(unitVel);
          return;
        }
      }

      const localTargetCell = gridFF.getCellValueByPoint(unit.loc);
      let targetCellPoint = localTargetCell !== void 0
        ? gridFF.getPointByCell(localTargetCell)
        : order.targetPoint;
      const unitCellPoint = gridFF.getPointByCell(gridFF.getCellByPoint(unit.loc));
      const vecUC2Unit = new Point(unit.loc).sub(unitCellPoint);
      const vecUC2TC = new Point(targetCellPoint).add(vecUC2Unit).sub(unit.loc);
      const desiredVel = new Point(vecUC2TC).norm();

      console.log(gridFF.getCellByPoint(unit.loc), localTargetCell);
      console.log('unit', new Point(unit.loc));
      console.log('unitCellPoint', unitCellPoint);
      console.log('targetCellPoint', targetCellPoint);
      console.log(vecUC2Unit, vecUC2TC, desiredVel.toPolarString());

      // let aheadC = predictUnitLoc(new Point(unit.vel).mul(4));
      // const unitsC = level.getEntitiesNear(aheadC, unit.radius * 2.2, e => e !== unit);
      // if (unitsC.length > 0) {
      //   let minUnit = unitsC[0], minDist = unit.radius * 2;
      //   unitsC.forEach((u, i) => {
      //     let dist = unit.loc.dist2(u.loc);
      //     if (dist < minDist) {
      //       minDist = dist;
      //       minUnit = u;
      //     }
      //   });
      //   const dist = aheadC.sub(minUnit.loc).norm();
      //   desiredVel.add(dist);
      // }
      // aheadC = predictUnitLoc(new Point(unit.vel.add(desiredVel).norm()).mul(2));
      // const forceWalls = new Point();
      // const localWallCell = gridWalls.getCellByPoint(aheadC);
      // const wallcheck = [
      //   [localWallCell[0] + 0, localWallCell[1] + 0]
      //   , [localWallCell[0] + 1, localWallCell[1] + 0]
      //   , [localWallCell[0] + 0, localWallCell[1] + 1]
      //   , [localWallCell[0] - 1, localWallCell[1] + 0]
      //   , [localWallCell[0] + 0, localWallCell[1] - 1]
      //   , [localWallCell[0] + 1, localWallCell[1] - 1]
      //   , [localWallCell[0] + 1, localWallCell[1] + 1]
      //   , [localWallCell[0] - 1, localWallCell[1] + 1]
      //   , [localWallCell[0] - 1, localWallCell[1] - 1]
      // ]
      //   .filter((cell) => gridWalls.getCellValue(cell) > 255)
      //   .forEach((cell) => {
      //     const cellPoint = gridWalls.getPointByCell(cell);
      //     if (intersects(cellPoint, unit)) {
      //       const dist = new Point(aheadC).sub(cellPoint);
      //       // forceWalls.set(1 - dist.x, 1 - dist.y).mul(-1);
      //       desiredVel.add(dist.norm());
      //       console.log('ADDED')
      //     }
      //   });

      unit.vel.set(0,0);
      // unitVel.add(unitVel);
      unit.vel.add(desiredVel);
      console.log(unit.vel.toPolarString());

      // console.log(unitVel.len().toFixed(2), unit.vel.len().toFixed(2))

      // const steering = new Point();
      // steering.add(seekForce);
      // steering.trunc(unit.accel);
      // steering.add(collUnitsForce.norm());
      // steering.add(collWallsForce.norm());
      //
      // unit.vel.add(steering).trunc(1);
      //
      // if (isNaN(unit.vel.x)) debugger

      function intersects(cell, unit) {
        const halfCellSize = gridWalls.cellSize / 2;
        const circleDistance = new Point(Math.abs(unit.loc.x - cell.x), Math.abs(unit.loc.y - cell.y));

        if (circleDistance.x > (halfCellSize + unit.radius)) return false;
        if (circleDistance.y > (halfCellSize + unit.radius)) return false;

        if (circleDistance.x <= (halfCellSize)) return true;
        if (circleDistance.y <= (halfCellSize)) return true;

        const cornerDistance_sq = Math.pow(circleDistance.x - halfCellSize, 2) + Math.pow(circleDistance.y - halfCellSize, 2);

        return (cornerDistance_sq <= (unit.radius * unit.radius));
      }
    }
  }
};

export const Orders = {
  FOLLOW: (entity) => ({type: 'FOLLOW', entity})
  , MOVE: (point) => ({type: 'MOVE', point})
};

export default class Unit extends Entity {
  // asd
  render() {
    this.gfx.clear();
    this.gfx.lineStyle(1);
    this.gfx.beginFill(0xFFFFFF);
    this.gfx.drawCircle(0, 0, this.radius);
    this.gfx.endFill();

    // const unit = this;
    // const ahead = new Point(unit.vel).mul(unit.speed + unit.radius);
    // const aheadl = new Point(ahead).rotate(1);
    // this.gfx.drawCircle(ahead.x, ahead.y, 2);
    // this.gfx.drawCircle(aheadl.x, aheadl.y, 2);

    // this.gfx.lineStyle(1, 0x0000FF);
  }
}


























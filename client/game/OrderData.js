import {GRID_TYPE} from './managers/GridManager';
import GameData from "./GameData";
import KeyCode from "./managers/KeyCode";
import Point from "./geom/Point";
import * as Geom from './geom/Geom';

const awaitSpacebar = (game) => new Promise((resolve) => {
  game.ui.once('keyup.' + KeyCode.SPACEBAR, (e) => {
    resolve();
  });
  game.renderer.render(game.stage);
});

const debug = false;

export default {
  MOVE: function (game, unit, data) {
    const gridManager = game.level.gridManager;

    const targetCell = gridManager.getCells().getCellByPoint(data.point);

    const ffGridKey = gridManager.getGridKey(GRID_TYPE.FLOWFIELD, targetCell);
    const ffGrid = gridManager.getGrid(ffGridKey);
    const unitCell = ffGrid.getCellByPoint(unit.loc);
    const unitCellMaxDistance = 2 * (gridManager.cellSize2 + unit.speed + unit.radius) * (gridManager.cellSize2 + unit.speed + unit.radius);
    const unitPossibleCells = ffGrid.getNear8(unitCell)
      .filter(cell => ffGrid.getPointByCell(cell).dist2(unit.loc) <= unitCellMaxDistance);
    // console.log(unitCellMaxDistance
    //   , unitCell
    //   , ffGrid.getNear8(unitCell).slice(0).map(c => c.concat([ffGrid.getPointByCell(c).dist2(unit.loc)]))
    //   , unitPossibleCells);

    if (!unit.vel) unit.vel = new Point();

    const forceTarget = new Point(ffGrid.getCellValue(unitCell));
    let unitPossibleCellsCounter = 1;
    unitPossibleCells.forEach(cell => {
      const cellValue = new Point(ffGrid.getCellValue(cell));
      if (cellValue) {
        unitPossibleCellsCounter++;
        forceTarget.add(cellValue);
      }
    });
    forceTarget.mul(1 / unitPossibleCellsCounter);

    if (debug) unit.actor.debug.clear();

    let lookaheadSpeed = new Point()
      .add(unit.vel)
      .add(forceTarget)
      .mul(unit.speed);
    let lookaheadLoc = unit.loc.clone().add(lookaheadSpeed);

    if (debug) {
      unit.actor.debug.lineStyle(2, 0x0000FF, 1);
      debugVector(lookaheadSpeed);
      unit.actor.debug.lineStyle(1, 0x0000FF, 1);
      debugCircle(lookaheadSpeed);
    }

    // Walls
    const forceWallLookaheadDist = getNearestWallDistance(gridManager, unitPossibleCells, lookaheadLoc, unit.radius, unit, game);
    const forceWallLookaheadLen = forceWallLookaheadDist.len();
    const forceWallLookahead = forceWallLookaheadDist.clone()
      .norm(forceWallLookaheadLen)
      .mul((forceWallLookaheadLen + unit.speed * .5) / unit.speed);
    lookaheadSpeed = new Point()
      .add(unit.vel)
      .add(forceTarget)
      .add(forceWallLookahead)
      .mul(unit.speed);
    lookaheadLoc = unit.loc.clone().add(lookaheadSpeed);

    if (debug) {
      unit.actor.debug.lineStyle(2, 0xFF8800, 1);
      debugVector(forceWallLookahead.clone().mul(unit.speed));
      unit.actor.debug.lineStyle(4, 0xFF8800, .5);
      debugVector(lookaheadSpeed);
      unit.actor.debug.lineStyle(1, 0xFF8800, 1);
      debugCircle(lookaheadSpeed);
    }

    // Units
    const forceUnits = getUnitsForce(game.level, lookaheadLoc, unit);
    lookaheadSpeed = new Point()
      .add(unit.vel)
      .add(forceTarget)
      .add(forceWallLookahead)
      .add(forceUnits)
      .mul(unit.speed);
    lookaheadLoc = unit.loc.clone().add(lookaheadSpeed);

    if (debug) {
      if (forceUnits.not0()) {
        unit.actor.debug.lineStyle(2, 0xFF00FF, 1);
        debugVector(forceUnits.clone().mul(unit.speed * 5));
        unit.actor.debug.lineStyle(4, 0xFF00FF, .5);
        debugVector(lookaheadSpeed);
        unit.actor.debug.lineStyle(1, 0xFF00FF, 1);
        debugCircle(lookaheadSpeed);
      }
    }

    const unitVelocity = new Point()
      .add(forceTarget)
      .add(forceWallLookahead)
      .add(forceUnits)
      .mul(unit.speed);

    // const unitVelocity = new Point()
    //   .add(unit.vel)
    //   .add(unitAcceleration)
    //   .norm()
    //   .mul(unit.speed);

    // unit.vel = unitVelocity;

    // await awaitSpacebar(game);

    unit.loc.add(unitVelocity);
    unit.actor.rotation = Math.atan2(unitVelocity.y, unitVelocity.x);

    const forceWallDist = getNearestWallDistance(gridManager, unitPossibleCells, unit.loc, unit.radius, unit);

    if (debug) {
      unit.actor.debug.lineStyle(2, 0xFF0000);
      debugVector(forceWallDist);
    }

    // await awaitSpacebar(game);

    if (forceWallDist.not0) {
      unit.loc.add(forceWallDist);
    }

    // game.tick();

    // helpers

    function debugVector(p) {
      unit.actor.debug.moveTo(0, 0);
      unit.actor.debug.lineTo(p.x, p.y);
    }

    function debugCircle(loc) {
      unit.actor.debug.drawCircle(loc.x, loc.y, unit.radius);
    }
  }
}

const getUnitsForce = (level, testLoc, unit) => {
  const forceUnits = new Point();
  const unitsC = level.getEntitiesNear(testLoc, unit.radius * 2.5, e => e !== unit);
  unitsC.forEach((u, i) => {
    const unit2u = testLoc.clone().sub(u.loc);
    const unit2uLen = unit2u.len();
    const antiUnitForce = unit2u.norm(unit2uLen);
    if (unit2uLen <= (unit.radius + u.radius)) {
      const forceMultiplier = (unit.radius + u.radius - unit2uLen) / unit.speed;
      // console.log(unit2uLen, antiUnitForce, forceMultiplier);
      antiUnitForce.mul(forceMultiplier);
      forceUnits.add(antiUnitForce);
    } else {
      antiUnitForce.mul(unit.radius / unit2uLen);
      forceUnits.add(antiUnitForce);
    }
  });
  return forceUnits;
};

const getNearestWallDistance = (gridManager, unitPossibleCells, testLoc, unitRadius, unit, game) => {
  const forceWalls = new Point();
  const gridWalls = gridManager.getWalls();
  // game.level.debugGfx.clear();
  unitPossibleCells
    .filter((cell) => gridWalls.getCellValue(cell) > 255)
    .forEach((cell) => {
      const cellLoc = gridWalls.getPointByCell(cell);
      if (Geom.checkIsectRectCircle(cellLoc, gridManager.cellSize2, testLoc, unitRadius)) {
        const unit2cl = testLoc.clone().sub(cellLoc);
        const unit2clAbs = unit2cl.clone().abs();
        const csx = gridManager.cellSize2 * Math.sign(unit2cl.x);
        const csy = gridManager.cellSize2 * Math.sign(unit2cl.y);
        const urx = unitRadius * Math.sign(unit2cl.x);
        const ury = unitRadius * Math.sign(unit2cl.y);
        const mainLineA = new Point(cellLoc.x, cellLoc.y + csy + ury);
        const mainLineB = new Point(cellLoc.x + csx, cellLoc.y + csy + ury);
        const mainLineC = new Point(cellLoc.x + csx + urx, cellLoc.y + csy);
        const mainLineD = new Point(cellLoc.x + csx + urx, cellLoc.y);
        const mainLineCC = new Point(cellLoc.x + csx, cellLoc.y + csy);
        let isect;
        // game.level.debugGfx.lineStyle(2, 0xFF0000);
        if (unit2clAbs.x > unit2clAbs.y) {
          isect = Geom.isect4Points(cellLoc, testLoc, mainLineC, mainLineD);
          // game.level.debugGfx.drawCircle(isect.x, isect.y, 3);
          if (Math.abs(cellLoc.y - isect.y) > gridManager.cellSize2) {
            // game.level.debugGfx.lineStyle(2, 0x0000FF);
            isect = Geom.isectLineCircle(cellLoc, isect.clone(), mainLineCC, unitRadius);
          }
        } else {
          isect = Geom.isect4Points(cellLoc, testLoc, mainLineA, mainLineB);
          // game.level.debugGfx.drawCircle(isect.x, isect.y, 3);
          if (Math.abs(cellLoc.x - isect.x) > gridManager.cellSize2) {
            // game.level.debugGfx.lineStyle(2, 0x00FF00);
            isect = Geom.isectLineCircle(cellLoc, isect.clone(), mainLineCC, unitRadius);
          }
        }
        if (isect === null) return;
        const forceWall = isect.clone().sub(testLoc);
        // game.level.debugGfx.moveTo(mainLineA.x, mainLineA.y);
        // game.level.debugGfx.lineTo(mainLineB.x, mainLineB.y);
        // game.level.debugGfx.lineTo(mainLineC.x, mainLineC.y);
        // game.level.debugGfx.lineTo(mainLineD.x, mainLineD.y);
        // game.level.debugGfx.lineStyle(1, 0xFF0000);
        // game.level.debugGfx.drawCircle(isect.x, isect.y, 3);
        // game.level.debugGfx.drawCircle(mainLineCC.x, mainLineCC.y, unitRadius);
        // unit.actor.debug.moveTo(0, 0);
        // unit.actor.debug.lineTo(forceWall.x, forceWall.y);
        forceWalls.add(forceWall);
        // console.log(forceWall)
      }
    });
  return forceWalls;
};


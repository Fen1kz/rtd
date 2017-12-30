import ndarray from 'ndarray';
import ndforEach from 'ndarray-foreach';
import Point from './Point';
import Cell from './Cell';

import GameData from '../GameData';

const NEAR_4 = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const NEAR_8 = [[0, -1], [1, 0], [0, 1], [-1, 0], [+1, -1], [+1, +1], [-1, +1], [-1, -1]];

export default class Grid {
  constructor(type, width, height, cellSize) {
    this.type = type;
    this.cellSize = cellSize;
    this.width = Math.floor(width / this.cellSize);
    this.height = Math.floor(height / this.cellSize);
    this.cellSize = GameData.c.cellSize;
    this.cells = ndarray([], [this.width, this.height]);
  }

  checkBoundsXY(X, Y) {
    return X >= 0 && X < this.width && Y >= 0 && Y < this.height;
  }

  getCellValueXY(X, Y) {
    return this.checkBoundsXY(X, Y) ? this.cells.get(X, Y) : void 0;
  }

  getCellValue(cell) {
    return this.getCellValueXY(cell[0], cell[1]);
  }

  getCellValueByPoint(point) {
    return this.getCellValueXY(Math.floor(point.x / this.cellSize), Math.floor(point.y / this.cellSize));
  }

  setCellValue(cell, value) {
    return this.cells.set(cell[0], cell[1], value);
  }

  getCellByPoint(point) {
    return [Math.floor(point.x / this.cellSize), Math.floor(point.y / this.cellSize)];
  }

  getPointByCell(cell) {
    return new Point(
      cell[0] * this.cellSize + this.cellSize / 2
      , cell[1] * this.cellSize + this.cellSize / 2
    );
  }

  forEach(cb) {
    ndforEach(this.cells, cb);
  }

  fillDkstra(gridWall, exitCell) {
    const frontier = [exitCell];
    this.setCellValue(exitCell, 0);
    for (let i = 0; i < frontier.length; ++i) {
      const cellFront = frontier[i];
      const distFront = this.getCellValue(cellFront);
      this.getNear4(cellFront)
        .forEach((cellNearFront) => {
        const costOfNear = gridWall.getCellValue(cellNearFront);
        const distOfNear = this.getCellValue(cellNearFront);
        if (distOfNear === void 0 && costOfNear !== void 0) {
          this.setCellValue(cellNearFront, distFront + costOfNear);
          if (costOfNear <= 255) {
            frontier.push(cellNearFront);
          }
        }
      });
    }
  }

  fillFlowField(gridWall, gridDkstra) {
    ndforEach(gridDkstra.cells, (cell, dist) => {
      let bestCell = null;
      let minDist = 0;

      const [freeN, freeE, freeS, freeW] = this.getNear4(cell).map(near4Cell => gridWall.getCellValue(near4Cell) < 255);

      this.getNear4(cell)
        .concat([
            (freeN && freeE) && [cell[0] + 1, cell[1] - 1] // NE
          , (freeS && freeE) && [cell[0] + 1, cell[1] + 1] // SE
          , (freeS && freeW) && [cell[0] - 1, cell[1] + 1] // SW
          , (freeN && freeW) && [cell[0] - 1, cell[1] - 1] // NW
        ])
        .filter(c => !!c)
        .forEach((cellNear) => {
          const distOfNear = gridDkstra.getCellValue(cellNear);
          if ((distOfNear - dist) < minDist) {
            bestCell = cellNear;
            minDist = (distOfNear - dist);
          }
        });
      if (bestCell !== null) {
        this.setCellValue(cell, new Point(bestCell[0] - cell[0], bestCell[1] - cell[1]).norm());
      }
    });
  }

  getNear4(cell) {
    return NEAR_4.map(v => [+cell[0] + v[0], +cell[1] + v[1]]);
  }

  getNear8(cell) {
    // return NEAR_8.map(v => [cell[0] + v[0], cell[1] + v[1]]);
    return NEAR_8.map(v => [+cell[0] + v[0], +cell[1] + v[1]]);
  }
}
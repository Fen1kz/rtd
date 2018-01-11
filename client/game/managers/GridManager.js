import Grid from '../geom/Grid';
import Point from '../geom/Point';


export const GRID_TYPE = {
  XY: 'XY'
  , WALL: 'WALL'
  , DKSTRA: 'DKSTRA'
  , FLOWFIELD: 'FLOWFIELD'
  , UNIT: 'UNIT'
};

export default class GridManager {
  constructor(width, height, cellSize) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.cellSize2 = cellSize * .5;

    this.WIDTH = Math.floor(width / this.cellSize);
    this.HEIGHT = Math.floor(height / this.cellSize);

    this.gridWalls = new Grid(this.WIDTH, this.HEIGHT);

    this.gridCacheFF = new Array(this.WIDTH * this.HEIGHT);
    this.gridCacheDist = new Array(this.WIDTH * this.HEIGHT);
  }

  getCellByPoint(point) {
    const x = Math.floor(point.x / this.cellSize);
    const y = Math.floor(point.y / this.cellSize);
    return x + y * this.WIDTH;
  }

  getPointByCell(cell) {
    return new Point(
      this.getX(cell) * this.cellSize + this.cellSize / 2
      , this.getY(cell) * this.cellSize + this.cellSize / 2
    );
  }

  isWall(cellIdx) {
    return this.getWalls().getCellValue(cellIdx) > 255;
  }

  getX(cellIdx) {
    return cellIdx % this.WIDTH;
  }

  getY(cellIdx) {
    return Math.floor(cellIdx / this.WIDTH);
  }

  getIdx(x, y) {
    return x + y * this.WIDTH;
  }

  getWalls() {
    return this.gridWalls;
  }

  getGridFF(cellIdx) {
    if (this.gridCacheFF[cellIdx]) return this.gridCacheFF[cellIdx];
    // const tempGrid = new Grid(this.WIDTH, this.HEIGHT);
    const grid = new Grid(this.WIDTH, this.HEIGHT);
    this.fillFlowField(grid, this.getWalls(), this.getGridDist(cellIdx));
    // for (let i = 0; i < 2; ++i) this.smoothGrid(grid, grid, cellIdx);
    this.gridCacheFF[cellIdx] = grid;
    return grid;
  }

  getGridDist(cellIdx) {
    if (this.gridCacheDist[cellIdx]) return this.gridCacheDist[cellIdx];
    const grid = new Grid(this.WIDTH, this.HEIGHT);
    this.fillGridDist(grid, this.getWalls(), cellIdx);
    this.gridCacheDist[cellIdx] = grid;
    return grid;
  }

  fillGridDist(gridDist, gridWall, exitIdx) {
    const frontier = [exitIdx];
    gridDist.setCellValue(exitIdx, 0);
    for (let i = 0; i < frontier.length; ++i) {
      const frontIdx = frontier[i];
      const distFront = gridDist.getCellValue(frontIdx);
      this.getNear4(frontIdx)
        .forEach((frontNeighborIdx) => {
          const costOfNear = gridWall.getCellValue(frontNeighborIdx);
          const distOfNear = gridDist.getCellValue(frontNeighborIdx);
          if (distOfNear === void 0 && costOfNear !== void 0) {
            gridDist.setCellValue(frontNeighborIdx, distFront + costOfNear);
            if (!this.isWall(frontNeighborIdx)) {
              frontier.push(frontNeighborIdx);
            }
          }
        });
    }
  }

  fillFlowField(gridFF, gridWall, gridDist) {
    gridDist.forEach((dist, cellIdx) => {
      let bestCell = null;
      let minDist = 0;

      const near4 = this.getNear4(cellIdx);

      const [freeN, freeE, freeS, freeW] = near4.map(nearCellIdx => !this.isWall(cellIdx));

      const X = this.getX(cellIdx);
      const Y = this.getY(cellIdx);

      near4
        .concat([
          (freeN && freeE) && this.checkXY(X + 1, Y - 1) && this.getIdx(X + 1, Y - 1) // NE
          , (freeS && freeE) && this.checkXY(X + 1, Y + 1) && this.getIdx(X + 1, Y + 1) // SE
          , (freeS && freeW) && this.checkXY(X - 1, Y + 1) && this.getIdx(X - 1, Y + 1) // SW
          , (freeN && freeW) && this.checkXY(X - 1, Y - 1) && this.getIdx(X - 1, Y - 1) // NW
        ])
        .filter(c => !!c)
        .forEach((cellNear) => {
          const distOfNear = gridDist.getCellValue(cellNear);
          if ((distOfNear - dist) < minDist) {
            bestCell = cellNear;
            minDist = (distOfNear - dist);
          }
        });

      if (bestCell !== null) {
        gridFF.setCellValue(cellIdx, new Point(this.getX(bestCell) - this.getX(cellIdx), this.getY(bestCell) - this.getY(cellIdx)).norm());
      }
    });
  }

  smoothGrid(grid, gridFF, exitCellIdx) {
    gridFF.forEach((targetVector, cellIdx) => {
      if (!targetVector) targetVector = new Point();
      grid.setCellValue(cellIdx, targetVector);

      if (cellIdx === exitCellIdx) return;

      const near = this.getNear8(cellIdx);

      const isNearWall = near.some(adjCell => this.isWall(adjCell));
      if (isNearWall) return;
      if (near.length < 1) return;

      const smoothTargetVector = new Point();
      near.forEach(nearCell => {
        smoothTargetVector.add(gridFF.getCellValue(nearCell) || new Point());
      });
      smoothTargetVector.norm();
      grid.setCellValue(cellIdx, smoothTargetVector);
    });
  }

  checkXY(X, Y) {
    return X >= 0 && X < this.WIDTH && Y >= 0 && Y < this.HEIGHT;
  }

  getNear4(cellIdx) {
    // https://jsperf.com/get-near-4
    const x = this.getX(cellIdx);
    const y = this.getY(cellIdx);
    const result = [];
    if (this.checkXY(x, y - 1)) result.push(this.getIdx(x, y - 1));
    if (this.checkXY(x, y + 1)) result.push(this.getIdx(x, y + 1));
    if (this.checkXY(x - 1, y)) result.push(this.getIdx(x - 1, y));
    if (this.checkXY(x + 1, y)) result.push(this.getIdx(x + 1, y));
    return result;
  }

  getNear8(cellIdx) {
    const x = this.getX(cellIdx);
    const y = this.getY(cellIdx);
    const result = [];
    if (this.checkXY(x, y - 1)) result.push(this.getIdx(x, y - 1));
    if (this.checkXY(x - 1, y)) result.push(this.getIdx(x - 1, y));
    if (this.checkXY(x, y + 1)) result.push(this.getIdx(x, y + 1));
    if (this.checkXY(x + 1, y)) result.push(this.getIdx(x + 1, y));
    if (this.checkXY(x - 1, y - 1)) result.push(this.getIdx(x - 1, y - 1));
    if (this.checkXY(x - 1, y + 1)) result.push(this.getIdx(x - 1, y + 1));
    if (this.checkXY(x + 1, y - 1)) result.push(this.getIdx(x + 1, y - 1));
    if (this.checkXY(x + 1, y + 1)) result.push(this.getIdx(x + 1, y + 1));
    return result;
  }

  clearCache() {
    this.gridCacheDist = {};
    this.gridCacheFF = {};
  }


  render(gfx) {
    gfx.clear();
    gfx.removeChildren();

    const cellToLoc = (cell) => ({x: this.getX(cell) * this.cellSize, y: this.getY(cell) * this.cellSize});
    const cellCenterToLoc = (cell) => ({
      x: (this.getX(cell) + .5) * this.cellSize,
      y: (this.getY(cell) + .5) * this.cellSize
    });

    gfx.lineStyle(1, 0x0, 0.1);
    this.gridWalls.forEach((value, cell) => {
      const {x, y} = cellToLoc(cell);
      gfx.beginFill(value < 255 ? 0xFFFFFF : 0x0);
      gfx.drawRect(x, y, this.cellSize, this.cellSize);
    });

    for (let gridKey in this.gridCacheDist) {
      const grid = this.gridCacheDist[gridKey];
      grid.forEach((value, cell) => {
        const point = this.getPointByCell(cell);
        const text = new PIXI.Text(value, {fill: 0xAAAAFF, fontSize: this.cellSize / 3, align: 'center'});
        text.anchor.set(0.5);
        text.position.set(point.x, point.y);
        gfx.addChild(text);
      });
    }

    for (let gridKey in this.gridCacheFF) {
      const grid = this.gridCacheFF[gridKey];
      gfx.lineStyle(1, 0x0000FF, 1);
      grid.forEach((value, cell) => {
        if (value) {
          const point = this.getPointByCell(cell);
          gfx.moveTo(point.x, point.y);
          gfx.lineTo(point.x + value.x * .5 * this.cellSize, point.y + value.y * .5 * this.cellSize);
        }
      });
    }
  }
}
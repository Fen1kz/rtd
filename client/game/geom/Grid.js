import ndarray from 'ndarray';
import ndforEach from 'ndarray-foreach';

import Point from './Point';

export default class Grid {
  constructor(key, type, width, height, cellSize) {
    this.key = key;
    this.type = type;
    this.cellSize = cellSize;
    this.width = Math.floor(width / this.cellSize);
    this.height = Math.floor(height / this.cellSize);
    this.cells = ndarray([], [this.width, this.height]);
  }

  getCellValueXY(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height ? this.cells.get(x, y) : void 0;
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

  fillByCallback(cb) {
    ndforEach(this.cells, (cell, v) => {
      const nv = cb(cell[0] * this.cellSize + this.cellSize / 2, cell[1] * this.cellSize + this.cellSize / 2, v);
      if (nv != v) {
        this.setCellValue(cell, nv);
      }
    });
  }

  fillDkstra(gridWall, tx, ty) {
    const exitCell = [tx, ty];
    const frontier = [exitCell];
    this.setCellValue(exitCell, 0);
    for (let i = 0; i < frontier.length; ++i) {
      const cellFront = frontier[i];
      const [x, y] = cellFront;
      const distFront = this.getCellValue(cellFront);
      [
        [x + 1, y + 0]
        , [x + 0, y + 1]
        , [x - 1, y + 0]
        , [x + 0, y - 1]
      ].forEach((cellNearFront) => {
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
    ndforEach(gridDkstra.cells, ([x, y], dist) => {
      let bestCell = null;
      let minDist = 0;

      const freeN = gridWall.getCellValueXY(x + 0, y - 1) < 255;
      const freeE = gridWall.getCellValueXY(x + 1, y + 0) < 255;
      const freeS = gridWall.getCellValueXY(x + 0, y + 1) < 255;
      const freeW = gridWall.getCellValueXY(x - 1, y + 0) < 255;

      [
        [x + 0, y - 1]
        , [x + 1, y + 0]
        , [x + 0, y + 1]
        , [x - 1, y + 0]
        , (freeN && freeE) && [x + 1, y - 1] // NE
        , (freeS && freeE) && [x + 1, y + 1] // SE
        , (freeS && freeW) && [x - 1, y + 1] // SW
        , (freeN && freeW) && [x - 1, y - 1] // NW
      ].filter(c => !!c)
        .forEach((cellNear) => {
          const distOfNear = gridDkstra.getCellValue(cellNear);
          if ((distOfNear - dist) < minDist) {
            bestCell = cellNear;
            minDist = (distOfNear - dist);
          }
        });
      if (bestCell !== null) {
        this.setCellValue([x, y], bestCell);
      }
    });
  }

  renderWall(gfx) {
    gfx.lineStyle(1, 0x0, 0.1)
    ndforEach(this.cells, ([x, y], v) => {
      gfx.beginFill(v < 255 ? 0xFFFFFF : 0x0);
      gfx.drawRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    });
  }

  renderFlowField(gfx) {
    // ndforEach(dkstra, ([x, y], v) => {
    //   const txt = new PIXI.Text(v, {fontSize: this.cellSize / 4});
    //   txt.position.set(x * this.cellSize, y * this.cellSize);
    //   gfx.addChild(txt)
    //
    //   // const FFv = FF.get(x, y);
    //   // if (FFv) {
    //   //   const txt = new PIXI.Text(`${x}:${y}\n(${v})\n[${FFv}]`, {fontSize: this.cellSize / 4});
    //   //   txt.position.set(x * this.cellSize, y * this.cellSize);
    //   //   gfx.addChild(txt)
    //   // }
    // });
    gfx.lineStyle(1, 0x0000FF);
    console.log(this.cells)
    ndforEach(this.cells, (cell, v) => {
      if (v) {
        const [nx, ny] = v;
        const a = Math.atan2(ny - cell[1], nx - cell[0]);
        // console.log(`${x}:${y} => ${nx}:${ny} (${a * 180 / Math.PI})`)
        const point = this.getPointByCell(cell);
        gfx.moveTo(point.x, point.y);
        point.polar(this.cellSize * .5, a);
        gfx.lineTo(point.x, point.y);
      }
    });
  }
}
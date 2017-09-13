import ndarray from 'ndarray';
import ndforEach from 'ndarray-foreach';

import Point from './Point';

export const CELL_SIZE = 50;

const getCCP = (xy) => xy * CELL_SIZE + CELL_SIZE / 2; // getCellCenterPixel

export default class Grid {
  getCCP = getCCP;

  constructor(widht, height) {
    this.width = Math.floor(widht / CELL_SIZE);
    this.height = Math.floor(height / CELL_SIZE);
    this.cells = ndarray([], [this.width, this.height]);
    this.FFCache = {};
    window.pts = this.cells;
    window.ndarray = ndarray;
    window.ndforEach = ndforEach;
  }

  recalculate(cb) {
    ndforEach(this.cells, ([x, y], v) => {
      const nv = cb(getCCP(x), getCCP(y), v);
      if (nv != v) {
        this.cells.set(x, y, nv);
      }
    });
  }

  getNDValue(ndarray, x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height ? ndarray.get(x, y) : void 0;
  }

  getCellByPixels(point) {
    return [Math.floor(point.x / CELL_SIZE), Math.floor(point.y / CELL_SIZE)];
  }

  getCellCenterByPixels(point) {
    return new Point(
      getCCP(Math.floor(point.x / CELL_SIZE))
      , getCCP(Math.floor(point.y / CELL_SIZE))
    );
  }

  getPointPathing(point) {
    return this.getNDValue(this.cells, Math.floor(point.x / CELL_SIZE), Math.floor(point.y / CELL_SIZE));
  }

  getFFNextPoint(FFKey, currentPoint) {
    const FF = this.getFF(FFKey);
    const [cx, cy] = this.getCellByPixels(currentPoint);
    const value = this.getNDValue(FF, cx, cy);
    if (value) {
      return new Point(getCCP(value[0]), getCCP(value[1]));
    }
  }

  makeFFKey = (x, y) => x + ':' + y;

  getFF(FFKey) {
    if (this.FFCache[FFKey]) {
      return this.FFCache[FFKey];
    } else {
      const [x, y] = FFKey.split(':');
      return this.createFF(+x, +y);
    }
  }

  createFF(tx, ty) {
    const FFKey = this.makeFFKey(tx, ty);

    const dkstra = ndarray([], [this.width, this.height]);
    const FF = ndarray([], [this.width, this.height]);
    window.dkstra = dkstra;
    window.FF = FF;

    const frontier = [[tx, ty]];
    dkstra.set(tx, ty, 0);
    for (let i = 0; i < frontier.length; ++i) {
      const [x, y] = frontier[i];
      const distOfFront = this.getNDValue(dkstra, x, y);
      [
        [x + 1, y + 0]
        , [x + 0, y + 1]
        , [x - 1, y + 0]
        , [x + 0, y - 1]
      ].forEach(([nx, ny]) => {
        const costOfNear = this.getNDValue(this.cells, nx, ny);
        const distOfNear = this.getNDValue(dkstra, nx, ny);
        if (distOfNear === void 0 && costOfNear !== void 0) {
          dkstra.set(nx, ny, distOfFront + costOfNear);
          if (costOfNear <= 255) {
            frontier.push([nx, ny]);
          }
        }
      });
    }

    ndforEach(dkstra, ([x, y], dist) => {
      let minX = null;
      let minY = null;
      let minDist = 0;

      // north
      const freeN = this.getNDValue(this.cells, x + 0, y - 1) < 255;
      const freeE = this.getNDValue(this.cells, x + 1, y + 0) < 255;
      const freeS = this.getNDValue(this.cells, x + 0, y + 1) < 255;
      const freeW = this.getNDValue(this.cells, x - 1, y + 0) < 255;

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
        .forEach(([nx, ny]) => {
          const distOfNear = this.getNDValue(dkstra, nx, ny);
          if ((distOfNear - dist) < minDist) {
            minX = nx;
            minY = ny;
            minDist = (distOfNear - dist);
          }
        });
      // console.log(`${x}:${y} =${minDist}> ${minX}:${minY}`)
      if (minX !== null) {
        FF.set(x, y, [minX, minY]);
      }
    });

    this.FFCache[FFKey] = FF;

    return FF;
  }

  clearFFCache = () => this.FFCache = {};

  render(gfx) {
    // gfx.lineStyle(1);
    ndforEach(this.cells, ([x, y], v) => {
      gfx.beginFill(v < 255 ? 0xFFFFFF : 0x0);
      gfx.drawRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
  }

  renderFF(gfx, FF) {
    // ndforEach(dkstra, ([x, y], v) => {
    //   const txt = new PIXI.Text(v, {fontSize: CELL_SIZE / 4});
    //   txt.position.set(x * CELL_SIZE, y * CELL_SIZE);
    //   gfx.addChild(txt)
    //
    //   // const FFv = FF.get(x, y);
    //   // if (FFv) {
    //   //   const txt = new PIXI.Text(`${x}:${y}\n(${v})\n[${FFv}]`, {fontSize: CELL_SIZE / 4});
    //   //   txt.position.set(x * CELL_SIZE, y * CELL_SIZE);
    //   //   gfx.addChild(txt)
    //   // }
    // });
    gfx.lineStyle(1, 0x0000FF);
    ndforEach(FF, ([x, y], v) => {
      if (v) {
        const [nx, ny] = v;
        const a = Math.atan2(ny - y, nx - x);
        // console.log(`${x}:${y} => ${nx}:${ny} (${a * 180 / Math.PI})`)
        gfx.moveTo(getCCP(x), getCCP(y));
        gfx.lineTo(getCCP(x) + CELL_SIZE * .5 * Math.cos(a), getCCP(y) + CELL_SIZE * .5 * Math.sin(a));
      }
    });
  }
}
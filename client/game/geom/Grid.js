import ndarray from 'ndarray';
import ndforEach from 'ndarray-foreach';

export const CELL_SIZE = 13;

export default class Grid {
  constructor(widht, height) {
    this.width = Math.floor(widht / CELL_SIZE);
    this.height = Math.floor(height / CELL_SIZE);
    this.cells = ndarray(Array(this.width * this.height).fill().map(u => 1), [this.width, this.height]);
    window.pts = this.cells;
  }

  getC(xy) {
    return xy * CELL_SIZE + CELL_SIZE / 2;
  }

  recalculate(cb) {
    ndforEach(this.cells, (i, v) => {
      const nv = cb(this.getC(i[0]), this.getC(i[1]), v);
      if (nv != v) this.cells.set(i[0], i[1], nv);
    });
  }

  render(gfx) {
    gfx.lineStyle(1);
    ndforEach(this.cells, (i, v) => {
      gfx.beginFill(0xFFFFFF * (v));
      gfx.drawRect(i[0] * CELL_SIZE, i[1] * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
  }

  aStar(x0, y0, x1, y1) {
  }
}
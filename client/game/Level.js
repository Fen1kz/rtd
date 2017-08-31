import Cell from './Cell';
import {CELL_SIZE} from './Cell';

export default class Level {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  getCell(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
    return this.cells[x + y * this.width]
  }

  findCell(loc) {
    const x = Math.floor(loc.x / CELL_SIZE);
    const y = Math.floor(loc.y / CELL_SIZE);
    return this.getCell(x, y);
  }

  fill() {
    this.cells = [];
    for (let i = 0, j = this.width * this.height; i < j; ++i) {
      const x = i % this.width;
      const y = Math.floor(i / this.width);
      this.cells.push(new Cell(x, y));
    }

    this.cells.forEach((cell) => {
      cell.near4 = [
        this.getCell(cell.x, cell.y - 1)
        , this.getCell(cell.x + 1, cell.y)
        , this.getCell(cell.x, cell.y + 1)
        , this.getCell(cell.x - 1, cell.y)
      ].filter(c => !!c);
      cell.near8 = [
        this.getCell(cell.x, cell.y - 1)
        , this.getCell(cell.x + 1, cell.y - 1)
        , this.getCell(cell.x + 1, cell.y)
        , this.getCell(cell.x + 1, cell.y + 1)
        , this.getCell(cell.x, cell.y + 1)
        , this.getCell(cell.x - 1, cell.y + 1)
        , this.getCell(cell.x - 1, cell.y)
        , this.getCell(cell.x - 1, cell.y - 1)
      ].filter(c => !!c);
    });

    return this;
  }

  recalculateWalls(probe) {
    this.cells.forEach((cell) => {
      const cx = cell.x * CELL_SIZE + CELL_SIZE / 2;
      const cy = cell.y * CELL_SIZE + CELL_SIZE / 2;
      cell.wall = !!(probe(cx, cy)
      || probe(cx - CELL_SIZE / 3, cy - CELL_SIZE / 3)
      || probe(cx - CELL_SIZE / 3, cy + CELL_SIZE / 3)
      || probe(cx + CELL_SIZE / 3, cy + CELL_SIZE / 3)
      || probe(cx + CELL_SIZE / 3, cy - CELL_SIZE / 3));
    });
  }

  recalculatePathing(rootExit) {
    this.cells.forEach(c => {
      c.distance = void 0;
      c.exit = void 0;
      c.base = void 0;
    });

    rootExit.base = true;
    rootExit.distance = 0;

    const frontier = [rootExit];

    for (let i = 0; i < frontier.length; ++i) {
      const cell = frontier[i];
      cell.near4.forEach(near => {
        if (near.distance === void 0 && !(cell.wall && !near.wall)) {
          near.distance = 1 + cell.distance;
          if (near.wall) {
            near.distance = 1000;
          }
          frontier.push(near);
        }
      });
    }

    this.cells.forEach(cell => {
      let minNear, minDist = 0;
      cell.near8.forEach(near => {
        const dist = near.distance - cell.distance;
        if (dist < minDist) {
          minNear = near;
          minDist = dist;
        }
      });
      if (minNear) {
        cell.exit = minNear;
      }
    });
  }

}
import Cell from './Cell';
import {CELL_SIZE} from './Cell';

export default class Level {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  getCell(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
    return this.cells[x + y * this.width]
  }

  findCell(loc) {
    const x = Math.round(loc.x);
    const y = Math.round(loc.y);
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
      cell.N = this.getCell(cell.x, cell.y - 1);
      cell.NE = this.getCell(cell.x + 1, cell.y - 1);
      cell.E = this.getCell(cell.x + 1, cell.y);
      cell.SE = this.getCell(cell.x + 1, cell.y + 1);
      cell.S = this.getCell(cell.x, cell.y + 1);
      cell.SW = this.getCell(cell.x - 1, cell.y + 1);
      cell.W = this.getCell(cell.x - 1, cell.y);
      cell.NW = this.getCell(cell.x - 1, cell.y - 1);
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

  recalculatePathing(x, y) {
    this.cells.forEach(c => {
      c.distance = void 0;
      c.exit = void 0;
    });

    const rootExit = this.getCell(x, y);
    rootExit.base = true;
    rootExit.distance = 0;

    const frontier = [];
    frontier.push(rootExit);

    let ops = 0, cell;
    while (frontier.length > 0 && ops++ < 2e3) {
      cell = frontier.shift();
      cell.getNear().forEach(near => {
        if (!near.wall && near.distance === void 0) {
          near.distance = 1 + cell.distance;
          near.exit = cell;
          frontier.push(near);
        }
      });
    }
  }

}
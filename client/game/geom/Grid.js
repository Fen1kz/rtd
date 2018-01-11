export default class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = new Array(this.width * this.height).fill();
  }

  getCellValue(cellIdx) {
    return this.cells[cellIdx];
  }

  setCellValue(cellIdx, value) {
    this.cells[cellIdx] = value;
  }

  forEach(cb) {
    this.cells.forEach(cb);
  }
}
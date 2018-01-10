import Grid from '../geom/Grid';
import Point from '../geom/Point';


export const GRID_TYPE = {
  XY: 'XY'
  , WALL: 'WALL'
  , DKSTRA: 'DKSTRA'
  , FLOWFIELD: 'FLOWFIELD'
  , VFIELD: 'VFIELD'
  , UNIT: 'UNIT'
};

export default class GridManager {
  constructor(width, height, cellSize) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.cellSize2 = cellSize * .5;
    this.gridCells = new Grid(GRID_TYPE.XY, width, height, this.cellSize);
    this.gridCells.forEach((cell, i) => {
      this.gridCells.setCellValue(cell, {x: cell[0], y: cell[1]});
    });
    this.gridWalls = new Grid(GRID_TYPE.WALL, width, height, this.cellSize);
    this.gridCache = {};
  }

  getCells() {
    return this.gridCells;
  }

  getWalls() {
    return this.gridWalls;
  }

  getGridKey(type, cell) {
    return type + ':' + cell[0] + ':' + cell[1];
  }

  getGrid(gridKey) {
    if (this.gridCache[gridKey]) {
      return this.gridCache[gridKey];
    } else {
      const [type, x, y] = gridKey.split(':');
      const grid = new Grid(type, this.width, this.height, this.cellSize);
      this.gridCache[gridKey] = grid;
      switch (type) {
        case GRID_TYPE.DKSTRA:
          grid.fillDkstra(this.getWalls(), [x, y]);
          console.log('fillingDkstra', grid)
          break;
        case GRID_TYPE.VFIELD:
          grid.fillVectorField(this.getWalls(), this.getGrid(this.getGridKey(GRID_TYPE.DKSTRA, [x, y])));
          // console.log('ff', grid)
          break;
        case GRID_TYPE.FLOWFIELD:
          grid.fillFlowField(this.getWalls(), this.getGrid(this.getGridKey(GRID_TYPE.VFIELD, [x, y])), [x, y]);
          for (let i = 0; i < 32; ++i) {
            grid.fillFlowField(this.getWalls(), this.getGrid(this.getGridKey(GRID_TYPE.FLOWFIELD, [x, y])), [x, y]);
          }
          // console.log('ff', grid)
          break;
      }
      return grid;
    }
  }

  clearCache() {
    this.gridCache = {};
  }


  render(gfx) {
    const cellToLoc = (cell) => ({x: cell[0] * this.cellSize, y: cell[1] * this.cellSize});
    const cellCenterToLoc = (cell) => ({x: (cell[0] + .5) * this.cellSize, y: (cell[1] + .5) * this.cellSize});
    gfx.lineStyle(1, 0x0, 0.1);
    this.gridWalls.forEach((cell, value) => {
      const {x, y} = cellToLoc(cell);
      gfx.beginFill(value < 255 ? 0xFFFFFF : 0x0);
      gfx.drawRect(x, y, this.cellSize, this.cellSize);
    });

    for (let gridKey in this.gridCache) {
      const grid = this.gridCache[gridKey];
      if (grid.type === GRID_TYPE.DKSTRA) {
        grid.forEach((cell, value) => {
          const point = grid.getPointByCell(cell);
          const text = new PIXI.Text(value, {fill: 0xAAAAFF, fontSize: this.cellSize / 3, align: 'center'});
          text.anchor.set(0.5);
          text.position.set(point.x, point.y);
          gfx.addChild(text);
        });
      } else if (grid.type === GRID_TYPE.FLOWFIELD) {
        gfx.lineStyle(1, 0x0000FF, 1);
        grid.forEach((cell, value) => {
          if (value) {
            const point = grid.getPointByCell(cell);
            gfx.moveTo(point.x, point.y);
            gfx.lineTo(point.x + value.x * .5 * this.cellSize, point.y + value.y * .5 * this.cellSize);
          }
        });
      }
    }
  }
}
// import Grid from '../geom/Grid';
// import Point from '../geom/Point';
//
//
// export const GRID_TYPE = {
//   WALL: 'WALL'
//   , DKSTRA: 'DKSTRA'
//   , FLOWFIELD: 'FLOWFIELD'
//   , UNIT: 'UNIT'
// };
//
// export default class GridManager {
//   constructor(width, height) {
//     this.width = width;
//     this.height = height;
//     this.cellSize = 25;
//     this.gridWalls = new Grid(GRID_TYPE.WALL, GRID_TYPE.WALL, width, height, this.cellSize);
//     this.gridCache = {};
//   }
//
//   makeGridKey = (type, x, y) => type + ':' + x + ':' + y;
//
//   getGrid(gridKey) {
//     if (this.gridCache[gridKey]) {
//       return this.gridCache[gridKey];
//     } else if (gridKey === GRID_TYPE.WALL) {
//       return this.gridWalls;
//     } else {
//       const [type, x, y] = gridKey.split(':');
//       const grid = new Grid(gridKey, type, this.width, this.height, this.cellSize);
//       this.gridCache[gridKey] = grid;
//       switch (type) {
//         case GRID_TYPE.DKSTRA:
//           grid.fillDkstra(this.getWalls(), +x, +y);
//           break;
//         case GRID_TYPE.FLOWFIELD:
//           const dkstraKey = this.makeGridKey(GRID_TYPE.DKSTRA, +x, +y);
//           grid.fillFlowField(this.getWalls(), this.getGrid(dkstraKey));
//           break;
//       }
//       return grid;
//     }
//   }
//
//   getWalls() {
//     return this.getGrid(GRID_TYPE.WALL);
//   }
//
//   recalculate(cb) {
//     this.getWalls().fillByCallback(cb);
//     this.gridCache = {};
//   }
//
//   clearFFCache = () => this.FFCache = {};
//
//   render(gfx) {
//     this.getWalls().renderWall(gfx);
//     Object.values(this.gridCache)
//       .filter(grid => grid.type === GRID_TYPE.FLOWFIELD)
//       .forEach(grid => grid.renderFlowField(gfx));
//   }
// }
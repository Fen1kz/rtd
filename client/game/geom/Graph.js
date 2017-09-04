import Point from './Point';


class Edge {
}

export default class Graph {
  constructor(points, edges) {
    this.points = points;
    this.edges = edges;
  }

  toArray() {
    const result = [];
    this.points.forEach(p => {
      result.push(p.x, p.y);
    });
    return result;
  }

  static fromPolygon(polygon) {
    const edges = [];
    polygon.points.forEach((p, i) => {
      if (i !== polygon.points - 1) {
        edges.push(i, i + 1)
      } else {
        edges.push(0, i)
      }
    });
    return new Graph(polygon.points, edges);
  }
}

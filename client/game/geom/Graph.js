import Point from './Point';


class Edge {
}

export default class Graph {
  constructor() {
    this.points = [];
    this.edges = [];
  }

  addPolygon(polygon) {
    const edges = [];
    polygon.points.forEach((p, i) => {
      if (i !== polygon.points - 1) {
        edges.push(i, i + 1)
      } else {
        edges.push(0, i)
      }
    });
    this.points.concat(polygon.points);
    this.edges.concat(edges);
    return this;
  }
}

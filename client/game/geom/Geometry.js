class Geometry {
  points = [];

  addPoint(p) {
    const length = this.points.length;
    this.points[length] = p;
    return length;
  }
}
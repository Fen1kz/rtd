export default class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set (x, y) {
    this.x = x;
    this.y = y;
  }

  angleTo(loc) {
    return Math.atan2(loc.y - this.y, loc.x - this.x);
  }

  dist2(loc) {
    return (loc.x - this.x) * (loc.x - this.x) + (loc.y - this.y) * (loc.y - this.y);
  }
}
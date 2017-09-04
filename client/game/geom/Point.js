export default class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set (x, y) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  polar(l, a) {
    this.x += l * Math.cos(a);
    this.y += l * Math.sin(a);
    return this;
  }
}
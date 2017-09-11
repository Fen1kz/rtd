export default class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
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

  sub(p) {
    this.x -= p.x;
    this.y -= p.y;
    return this;
  }

  norm() {
    const len = this.len();
    this.x /= len;
    this.y /= len;
    return this;
  }

  len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}
export default class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  polar(l, a) {
    this.x += l * Math.cos(a);
    this.y += l * Math.sin(a);
    return this;
  }

  toObservable(cb) {
    return new ObservablePoint(cb).set(this.x, this.y);
  }

  len() {
    return Math.sqrt(this.len2());
  }

  len2() {
    return this.x * this.x + this.y * this.y;
  }

  dist(p) {
    return Math.sqrt(this.dist2(p));
  }

  dist2(p) {
    return (this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y);
  }

  angleTo(p) {
    return Math.atan2(p.y - this.y, p.x - this.x);
  }

  norm() {
    const len = this.len();
    this.x /= len;
    this.y /= len;
    return this;
  }
}

class ObservablePoint extends Point {
  constructor(cb) {
    super();
    this.cb = cb;
  }

  set(x, y) {
    super.set(x, y);
    this.cb(this);
    return this;
  }

  polar(l, a) {
    super.polar(l, a);
    this.cb(this);
    return this;
  }
}


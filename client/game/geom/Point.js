export default class Point {
  constructor(x = 0, y = 0) {
    if (typeof x === 'object') {
      this.copy(x);
    } else {
      this.x = x;
      this.y = y;
    }
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  toObservable(cb) {
    return new ObservablePoint(cb).set(this.x, this.y);
  }

  // Chainable

  copy(p) {
    return this.set(p.x, p.y);
  }

  add(p) {
    return this.set(this.x + p.x, this.y + p.y);
  }

  sub(p) {
    return this.set(this.x - p.x, this.y - p.y);
  }

  mul(c) {
    return this.set(this.x * c, this.y * c);
  }

  polar(l, a) {
    return this.set(this.x + l * Math.cos(a), this.y + l * Math.sin(a));
  }

  norm() {
    return this.mul(1 / this.len());
  }

  trunc(c) {
    return this.set(
      this.x > 0 ? Math.min(this.x, c) : Math.max(this.x, -c)
      , this.y > 0 ? Math.min(this.y, c) : Math.max(this.y, -c)
    );
  }

  // Products

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

  angle() {
    return Math.atan2(this.y, this.x);
  }

  angleTo(p) {
    return Math.atan2(p.y - this.y, p.x - this.x);
  }

  rotate(a) {
    return this.set(this.x * Math.cos(a) - this.y * Math.sin(a), this.x * Math.cos(a) + this.y * Math.sin(a));
  }

  // // Chainable
  //
  // add = (p) => this.set(this.x + p.x, this.y + p.y);
  //
  // sub = (p) => this.set(this.x - p.x, this.y - p.y);
  //
  // mul = (p) => this.set(this.x * p.x, this.y * p.y);
  //
  // polar = (l, a) => this.set(this.x + l * Math.cos(a), this.y + l * Math.sin(a));
  //
  // norm = () => this.mul(1 / this.len());
  //
  // trunc = (c) => this.set(
  //   this.x > 0 ? Math.min(this.x, c) : Math.max(this.x, -c)
  //   , this.y > 0 ? Math.min(this.y, c) : Math.max(this.y, -c)
  // );
  //
  // // Products
  //
  // len = () => Math.sqrt(this.len2());
  //
  // len2 = () => this.x * this.x + this.y * this.y;
  //
  // dist = (p) => Math.sqrt(this.dist2(p));
  //
  // dist2 = (p) => (this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y);
  //
  // angleTo = (p) => Math.atan2(p.y - this.y, p.x - this.x);
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
}


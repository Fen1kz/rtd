import Point from './Point';
import Graph from './Graph';

const PI = Math.PI;
const PI2 = Math.PI * 2;

export default class Polygon {
  constructor(points = []) {
    this.points = points;
  }

  clone() {
  }

  toArray() {
    const result = [];
    this.points.forEach(p => {
      result.push(p.x, p.y);
    });
    return result;
  }

  calcClockwise() {
    return this.points.reduce((result, point, i) => {
        const v1 = point;
        const v2 = this.points[(i + 1) % this.points.length];
        return result + (v2.x - v1.x) * (v2.y + v1.y);
      }, 0) < 0;
  }

  static fromArray(array) {
    const points = [];
    for (let i = 0; i < array.length; i += 2) {
      points.push(new Point(array[i], array[i + 1]));
    }
    return new Polygon(points);
  }

  extrude(size) {
    const newPoints = [];
    let prev, curr, next;
    const clockwise = this.calcClockwise();
    console.log('---', clockwise);
    for (let i = 0; i < this.points.length; ++i) {
      prev = this.points[(i - 1 + this.points.length) % this.points.length];
      curr = this.points[i];
      next = this.points[(i + 1 + this.points.length) % this.points.length];

      const n = (a) => (a + PI2) % PI2;
      const r2g = (a) => a * 180 / PI;
      const g2r = (a) => a * PI / 180;

      const v0 = prev.clone().sub(curr).norm();
      const v1 = next.clone().sub(curr).norm();

      let angle1 = Math.atan2(v0.y, v0.x);
      let angle2 = Math.atan2(v1.y, v1.x);

      let angleD;
      let angle;
      if (clockwise) {
        angleD = n(angle2 - angle1);
        angle = angle1 + angleD / 2;
      } else {
        angleD = n(angle1 - angle2);
        angle = angle2 + angleD / 2;
      }

      if (angleD <= 1.5 * PI) {
        newPoints.push(curr.clone().polar(size, angle));
      } else {
        if (clockwise) {
          newPoints.push(curr.clone().polar(size, angle - PI / 6));
          newPoints.push(curr.clone().polar(size, angle + PI / 6));
        } else {
          newPoints.push(curr.clone().polar(size, angle + PI / 6));
          newPoints.push(curr.clone().polar(size, angle - PI / 6));
        }
      }
    }
    return new Polygon(newPoints);
  }
}
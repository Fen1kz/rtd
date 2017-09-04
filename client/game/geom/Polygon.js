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
    for (let i = 0; i < this.points.length; ++i) {
      prev = this.points[(i - 1 + this.points.length) % this.points.length];
      curr = this.points[i];
      next = this.points[(i + 1 + this.points.length) % this.points.length];

      const n = (a) => a < 0 ? a + PI2 : a;

      const dpcx = prev.x - curr.x;
      const dpcy = prev.y - curr.y;

      const dncx = next.x - curr.x;
      const dncy = next.y - curr.y;

      let angle1 = n(Math.atan2(dpcy, dpcx));
      if (angle1 === 0) angle1 += PI2;
      const angle2 = n(Math.atan2(dncy, dncx));
      let angle;
      if (angle1 > angle2) {
        angle = (angle2 + (angle1 - angle2) / 2) + PI;
      } else {
        angle = (angle1 + (angle2 - angle1) / 2) + PI;
      }


      console.log(prev, curr, next, dncx, dncy, dpcx, dpcy, dncy - dpcy, dncx - dpcx, angle1 * 180 / PI, angle2 * 180 / PI, angle * 180 / PI);
      // console.log(prev, curr, next, angle1 * 180 / PI, angle2 * 180 / PI, angle * 180 / PI);
      // console.log((angle1 - angle2) * 180 / PI);

      // newPoints.push(curr.clone().polar(size, 45 / 180 * PI));
      newPoints.push(curr.clone().polar(size, angle));
    }
    return new Polygon(newPoints);
  }
}
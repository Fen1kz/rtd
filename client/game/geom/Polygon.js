import {Polygon as PIXIPolygon} from 'pixi.js';
import ndarray from 'ndarray';
import show from 'ndarray-show';

window.show = show;

const PI = Math.PI;
const PI2 = Math.PI * 2;

export default class Polygon {
  constructor(points) {
    this.points = ndarray(points, [points.length / 2, 2]);
  }

  forEachPoint(cb) {
    for (let i = 0; i < this.points.data.length; i += 2) {
      cb(this.points.data[i], this.points.data[i + 1], Math.floor(i / 2));
    }
  }

  toPIXI() {
    return new PIXIPolygon(...this.points.data, this.points.data[0], this.points.data[1]);
  }
}
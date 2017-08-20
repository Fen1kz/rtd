import {Record, Map} from 'immutable';

export default class Point extends Record({
  x: 0
  , y: 0
}) {
  static new() {
    return new Point();
  }
}
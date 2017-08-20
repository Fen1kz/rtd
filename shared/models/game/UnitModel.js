import {Record, Map} from 'immutable';
import uuid from 'uuid';

import Point from '../geom/Point';

export default class UnitModel extends Record({
  id: null
  , loc: Point.new()
  , rot: 0
}) {
  static new() {
    return new UnitModel({
      id: uuid.v4()
    });
  }
}
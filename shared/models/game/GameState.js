import {Record, Map} from 'immutable';

export default class GameState extends Record({
  units: Map()
}) {
}
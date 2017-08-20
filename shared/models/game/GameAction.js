import {Record, Map} from 'immutable';

const GameAction = {};
export default GameAction;

GameAction.Type = {
  UNIT_CREATE: 'UNIT_CREATE'
  , UNIT_LOC_SET: 'UNIT_LOC_SET'
};

GameAction.Input = class InputAction extends Record({
  type: ''
  , subjectId: null
  , value: null
}) {
};

GameAction.MakeInput = {
  UNIT_LOC_ADD: (subjectId, value) => new InputAction({type: GameAction.Type.UNIT_LOC_ADD, subjectId, value})
};

GameAction.MakeDelta = {
  UNIT_CREATE: (delta, subjectId, value) => delta.setIn(['units', subjectId, ])
  , UNIT_LOC_ADD: (delta, subjectId, [x, y]) => delta.mergeIn(['units', subjectId, 'loc'], {x, y})
};
import {List} from 'immutable';

import GameState from './GameState';
import GameAction from './GameAction';

const getTimestamp = () => process.hrtime();


export default class GameModel {
  constructor() {
    this.stepFPS = 60;
    this.step = 1e3 / this.stepFPS;
    this.timeLast = getTimestamp();
    this.requestFrame = (fn) => {
      throw new Error('Define requestFrame')
    };
  }

  start() {
    this.requestFrame(this.onFrame);
  }

  onFrame = () => {
    const timeNow = getTimestamp();
    this.timeDelta = timeNow - this.timeLast;
    while (this.timeDelta > this.step) {
      this.timeDelta -= this.step;
      this.update(this.step);
    }
    this.render(this.timeDelta);
    this.timeLast = timeNow;
    this.requestFrame(this.onFrame);
  };

  update(dt) {
  }

  render(dt) {
  }

  // onState = (delta) => this.withMutations(game => {
  //   game.update('inputs', inputs => inputs.filter(inputPack => inputPack.timestamp > delta.timestamp));
  //   game.update('state', state => state.merge(delta));
  // });

  // processInputs() {
  //   return this.inputs.reduce((delta, inputAction) => {
  //     const updateFn = GameAction[inputAction.type];
  //     return updateFn(delta, inputAction.subjectId, inputAction.value);
  //   }, new GameState())
  // }
}
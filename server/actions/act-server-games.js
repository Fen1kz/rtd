import ServerGameModel from '../models/game/ServerGameModel';
import UnitModel from '../../shared/models/game/UnitModel';
import GameAction from '../../shared/models/game/GameAction';

import {userLogin} from '../../shared/actions'


export const server$gameCreate = () => (dispatch, getState) => {
  const game = ServerGameModel.create();
};

export const server$gameJoin = () => (dispatch, getState) => {
  // dispatch(new GameAction);
};
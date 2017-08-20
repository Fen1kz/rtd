import UserModel from '../../shared/models/UserModel';


import {userLogin} from '../../shared/actions'
import {server$gameCreate, server$gameJoin} from '../actions'

import {getGame} from '../reducers/rd-server-games';

export const server$userLogin = () => (dispatch, getState) => {
  const user = UserModel.new();
  const userId = user.id;
  dispatch(userLogin(user));

  if (!getGame(getState(), null)) {
    dispatch(server$gameCreate())
  }

  dispatch(server$gameJoin(null, userId));
};
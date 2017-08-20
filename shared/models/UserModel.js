import {Record, Map} from 'immutable';
import uuid from 'uuid';

export default class UserModel extends Record({
  id: null
}) {
  static new() {
    return new UserModel({
      id: uuid.v4()
    });
  }
}
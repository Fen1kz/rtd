export * from './act-server-sockets';
export * from './act-server-users';
export * from './act-server-games';

import {utilQuestionType, utilQuestionToServer} from '../../shared/actions/act-shared-questions';
import {socketsClientToServer} from './act-server-sockets';

export const clientToServer = Object.assign({}
  , socketsClientToServer
  , {
    [utilQuestionType.utilQuestionToServer]: (data, meta) => utilQuestionToServer({
      type: utilQuestionType.utilQuestionToServer
      , data
      , meta
    })
  }
);